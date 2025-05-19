/**
 * modal.js - Module pour la gestion des fenêtres modales
 * Fournit des méthodes pour interagir avec les fenêtres modales
 */

const Modal = (function () {
  // Stockage des callbacks pour chaque modal
  const callbacks = {};

  // Stockage des données de formulaire pour chaque modal
  const formData = {};

  // Indicateur de la méthode de fermeture
  const closeMethod = {};

  /**
   * Initialise le système de fenêtres modales
   */
  const init = () => {
    // Récupération de toutes les modales
    const modals = document.querySelectorAll(".modal");

    // Ajout des gestionnaires d'événements pour chaque modale
    modals.forEach((modal) => {
      const modalId = modal.id;

      // Initialisation du stockage pour ce modal
      formData[modalId] = null;
      closeMethod[modalId] = "save"; // Par défaut, on conserve les données

      // Boutons de fermeture (la croix)
      const closeButtons = modal.querySelectorAll(
        ".close-modal:not(.btn-secondary)"
      );
      closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // Conservation des données avec la croix
          closeMethod[modalId] = "save";
          close(modalId);
        });
      });

      // Boutons d'annulation (uniquement les boutons "Annuler")
      const cancelButtons = modal.querySelectorAll(
        ".btn-secondary.close-modal"
      );
      cancelButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // Réinitialisation lors de l'annulation
          closeMethod[modalId] = "reset";
          close(modalId);
        });
      });

      // Suppression des gestionnaires pour le clic en dehors et la touche Escape
      // (Commenté plutôt que supprimé pour référence)
      /*
      // Fermeture en cliquant en dehors de la modale
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          close(modalId);
        }
      });

      // Fermeture avec la touche Escape
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("active")) {
          close(modalId);
        }
      });
      */
    });

    // Initialisation du modal de confirmation
    initConfirmationModal();
  };

  /**
   * Initialise le modal de confirmation générique
   */
  const initConfirmationModal = () => {
    const confirmationModal = document.getElementById("confirmation-modal");
    const confirmButton = document.getElementById("confirm-action-btn");

    if (confirmationModal && confirmButton) {
      confirmButton.addEventListener("click", () => {
        // Exécution du callback de confirmation s'il existe
        if (
          callbacks["confirmation"] &&
          typeof callbacks["confirmation"] === "function"
        ) {
          callbacks["confirmation"]();
        }

        // Fermeture de la modale
        close("confirmation-modal");

        // Suppression du callback après utilisation
        delete callbacks["confirmation"];
      });
    }
  };

  /**
   * Sauvegarde les données d'un formulaire
   * @param {String} modalId - ID de la modale
   */
  const saveFormData = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const form = modal.querySelector("form");
    if (!form) return;

    // Création d'un objet pour stocker les valeurs
    const data = {};

    // Récupération de tous les champs du formulaire
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.name || element.id) {
        const key = element.name || element.id;
        if (element.type === "checkbox") {
          data[key] = element.checked;
        } else {
          data[key] = element.value;
        }
      }
    }

    // Sauvegarde des données
    formData[modalId] = data;
  };

  /**
   * Restaure les données d'un formulaire
   * @param {String} modalId - ID de la modale
   */
  const restoreFormData = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const form = modal.querySelector("form");
    if (!form || !formData[modalId]) return;

    // Restauration des valeurs dans le formulaire
    const data = formData[modalId];
    const elements = form.elements;

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.name || element.id) {
        const key = element.name || element.id;
        if (data[key] !== undefined) {
          if (element.type === "checkbox") {
            element.checked = data[key];
          } else {
            element.value = data[key];
          }
        }
      }
    }
  };

  /**
   * Ouvre une fenêtre modale
   * @param {String} modalId - ID de la modale à ouvrir
   * @param {Object} data - Données à passer à la modale
   * @param {Function} callback - Fonction de rappel à exécuter à la fermeture
   */
  const open = (modalId, data = {}, callback = null) => {
    const modal = document.getElementById(modalId);

    if (modal) {
      // Restauration des données du formulaire si disponibles et conservées
      if (formData[modalId] && closeMethod[modalId] === "save") {
        restoreFormData(modalId);
      }

      // Affichage de la modale
      modal.classList.add("active");

      // Stockage du callback
      if (callback && typeof callback === "function") {
        callbacks[modalId] = callback;
      }

      // Déclenchement d'un événement pour informer les autres modules
      document.dispatchEvent(
        new CustomEvent("modalOpened", {
          detail: { modalId, data },
        })
      );
    }
  };

  /**
   * Ferme une fenêtre modale
   * @param {String} modalId - ID de la modale à fermer
   * @param {*} result - Résultat à passer au callback
   */
  const close = (modalId, result = null) => {
    const modal = document.getElementById(modalId);

    if (modal) {
      // Sauvegarde des données du formulaire si méthode de fermeture = 'save'
      if (closeMethod[modalId] === "save") {
        saveFormData(modalId);
      } else {
        // Réinitialisation des données sauvegardées si méthode = 'reset'
        formData[modalId] = null;
      }

      // Masquage de la modale
      modal.classList.remove("active");

      // Exécution du callback s'il existe
      if (callbacks[modalId] && typeof callbacks[modalId] === "function") {
        callbacks[modalId](result);
      }

      // Déclenchement d'un événement pour informer les autres modules
      document.dispatchEvent(
        new CustomEvent("modalClosed", {
          detail: { modalId, result },
        })
      );
    }
  };

  /**
   * Affiche une boîte de dialogue de confirmation
   * @param {String} title - Titre de la confirmation
   * @param {String} message - Message de confirmation
   * @param {Function} onConfirm - Fonction à exécuter si l'utilisateur confirme
   * @param {String} confirmText - Texte du bouton de confirmation
   */
  const confirm = (title, message, onConfirm, confirmText = "Confirmer") => {
    const modal = document.getElementById("confirmation-modal");

    if (modal) {
      // Mise à jour du contenu de la modale
      const titleElement = document.getElementById("confirmation-title");
      const messageElement = document.getElementById("confirmation-message");
      const confirmButton = document.getElementById("confirm-action-btn");

      if (titleElement) titleElement.textContent = title;
      if (messageElement) messageElement.textContent = message;
      if (confirmButton) confirmButton.textContent = confirmText;

      // Stockage du callback de confirmation
      callbacks["confirmation"] = onConfirm;

      // Ouverture de la modale
      open("confirmation-modal");
    }
  };

  // Exposition de l'API publique
  return {
    init,
    open,
    close,
    confirm,
  };
})();

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", Modal.init);

// Exportation pour utilisation dans les autres modules
window.Modal = Modal;
