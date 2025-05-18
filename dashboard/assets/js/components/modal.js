/**
 * modal.js - Module pour la gestion des fenêtres modales
 * Fournit des méthodes pour interagir avec les fenêtres modales
 */

const Modal = (function () {
  // Stockage des callbacks pour chaque modal
  const callbacks = {};

  /**
   * Initialise le système de fenêtres modales
   */
  const init = () => {
    // Récupération de toutes les modales
    const modals = document.querySelectorAll(".modal");

    // Ajout des gestionnaires d'événements pour chaque modale
    modals.forEach((modal) => {
      const modalId = modal.id;

      // Boutons de fermeture
      const closeButtons = modal.querySelectorAll(".close-modal");
      closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          close(modalId);
        });
      });

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
   * Ouvre une fenêtre modale
   * @param {String} modalId - ID de la modale à ouvrir
   * @param {Object} data - Données à passer à la modale
   * @param {Function} callback - Fonction de rappel à exécuter à la fermeture
   */
  const open = (modalId, data = {}, callback = null) => {
    const modal = document.getElementById(modalId);

    if (modal) {
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
