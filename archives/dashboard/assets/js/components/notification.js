/**
 * notification.js - Module pour la gestion des notifications
 * Fournit un système de notifications toast
 */

const Notification = (function () {
  // Éléments DOM
  let container;

  // Compteur pour les IDs uniques
  let counter = 0;

  // Types de notifications
  const TYPES = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
  };

  // Icônes pour chaque type de notification
  const ICONS = {
    [TYPES.SUCCESS]: "fa-check-circle",
    [TYPES.ERROR]: "fa-times-circle",
    [TYPES.WARNING]: "fa-exclamation-triangle",
    [TYPES.INFO]: "fa-info-circle",
  };

  /**
   * Initialise le système de notifications
   */
  const init = () => {
    // Récupération du conteneur de notifications
    container = document.getElementById("notification-container");

    // Si le conteneur n'existe pas, on le crée
    if (!container) {
      container = document.createElement("div");
      container.id = "notification-container";
      container.className = "notification-container";
      document.body.appendChild(container);
    }
  };

  /**
   * Affiche une notification
   * @param {String} type - Type de notification (success, error, warning, info)
   * @param {String} title - Titre de la notification
   * @param {String} message - Message de la notification
   * @param {Number} duration - Durée d'affichage en ms (0 pour une notification persistante)
   */
  const show = (type, title, message, duration = CONFIG.UI.TOAST_DURATION) => {
    // Génération d'un ID unique pour cette notification
    const id = `notification-${++counter}`;

    // Création de l'élément de notification
    const notification = document.createElement("div");
    notification.id = id;
    notification.className = `notification ${type}`;

    // Structure HTML de la notification
    notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${ICONS[type]}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
            <div class="notification-progress">
                <div class="notification-progress-bar"></div>
            </div>
        `;

    // Ajout de la notification au conteneur
    container.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateX(0)";
    }, 10);

    // Gestionnaire pour le bouton de fermeture
    const closeButton = notification.querySelector(".notification-close");
    closeButton.addEventListener("click", () => {
      close(id);
    });

    // Fermeture automatique après la durée spécifiée
    if (duration > 0) {
      setTimeout(() => {
        close(id);
      }, duration);
    } else {
      // Si durée = 0, on supprime la barre de progression
      const progressBar = notification.querySelector(".notification-progress");
      if (progressBar) {
        progressBar.remove();
      }
    }

    // Retourne l'ID pour permettre la fermeture manuelle ultérieure
    return id;
  };

  /**
   * Ferme une notification spécifique
   * @param {String} id - ID de la notification à fermer
   */
  const close = (id) => {
    const notification = document.getElementById(id);

    if (notification) {
      // Animation de sortie
      notification.style.opacity = "0";
      notification.style.transform = "translateX(100%)";

      // Suppression de l'élément après l'animation
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  };

  /**
   * Ferme toutes les notifications
   */
  const closeAll = () => {
    const notifications = container.querySelectorAll(".notification");

    notifications.forEach((notification) => {
      close(notification.id);
    });
  };

  /**
   * Affiche une notification de succès
   * @param {String} title - Titre de la notification
   * @param {String} message - Message de la notification
   * @param {Number} duration - Durée d'affichage en ms
   */
  const success = (title, message, duration) => {
    return show(TYPES.SUCCESS, title, message, duration);
  };

  /**
   * Affiche une notification d'erreur
   * @param {String} title - Titre de la notification
   * @param {String} message - Message de la notification
   * @param {Number} duration - Durée d'affichage en ms
   */
  const error = (title, message, duration) => {
    return show(TYPES.ERROR, title, message, duration);
  };

  /**
   * Affiche une notification d'avertissement
   * @param {String} title - Titre de la notification
   * @param {String} message - Message de la notification
   * @param {Number} duration - Durée d'affichage en ms
   */
  const warning = (title, message, duration) => {
    return show(TYPES.WARNING, title, message, duration);
  };

  /**
   * Affiche une notification d'information
   * @param {String} title - Titre de la notification
   * @param {String} message - Message de la notification
   * @param {Number} duration - Durée d'affichage en ms
   */
  const info = (title, message, duration) => {
    return show(TYPES.INFO, title, message, duration);
  };

  // Exposition de l'API publique
  return {
    init,
    show,
    close,
    closeAll,
    success,
    error,
    warning,
    info,
    TYPES,
  };
})();

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", Notification.init);

// Exportation pour utilisation dans les autres modules
window.Notification = Notification;
