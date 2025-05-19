/**
 * app.js - Script principal de l'application
 * Initialise et coordonne tous les modules de l'application
 */

const App = (function () {
  /**
   * Initialise l'application
   */
  const init = () => {
    console.log("Initialisation de l'application EasyPark...");

    // Détection de la page active au chargement
    activatePageFromUrl();

    // Écoute des changements d'URL
    window.addEventListener("hashchange", handleHashChange);

    console.log("Application EasyPark initialisée.");
  };

  /**
   * Active la page correspondant à l'URL actuelle
   */
  const activatePageFromUrl = () => {
    // Récupération du hash de l'URL
    const hash = window.location.hash.substring(1);

    // Si le hash est vide, on active la page par défaut (dashboard)
    if (!hash) {
      Sidebar.activatePage("dashboard");
      return;
    }

    // Sinon, on active la page correspondant au hash
    Sidebar.activatePage(hash);
  };

  /**
   * Gère les changements d'URL
   */
  const handleHashChange = () => {
    activatePageFromUrl();
  };

  /**
   * Gère les erreurs globales de l'application
   * @param {Error} error - Erreur survenue
   */
  const handleError = (error) => {
    console.error("Erreur globale:", error);

    // Affichage d'une notification d'erreur
    Notification.error(
      "Erreur",
      "Une erreur inattendue est survenue. Veuillez réessayer."
    );
  };

  // Exposition de l'API publique
  return {
    init,
    handleError,
  };
})();

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", App.init);

// Gestion des erreurs globales
window.addEventListener("error", (event) => {
  App.handleError(event.error);
});

// Gestion des rejets de promesses non gérés
window.addEventListener("unhandledrejection", (event) => {
  App.handleError(event.reason);
});

// Exportation pour utilisation dans les autres modules
window.App = App;
