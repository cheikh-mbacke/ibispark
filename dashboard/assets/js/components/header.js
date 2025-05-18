/**
 * header.js - Module pour la gestion de l'en-tête
 * Gère les fonctionnalités de l'en-tête de l'application
 */

const Header = (function () {
  // Éléments DOM
  let searchBox;
  let notificationsIcon;
  let userProfile;

  /**
   * Initialise l'en-tête de l'application
   */
  const init = () => {
    // Récupération des éléments DOM
    searchBox = document.querySelector(".search-box input");
    notificationsIcon = document.querySelector(".notifications");
    userProfile = document.querySelector(".user-profile");

    // Initialisation de la recherche
    initSearch();

    // Initialisation des notifications
    initNotifications();

    // Initialisation du profil utilisateur
    initUserProfile();
  };

  /**
   * Initialise la fonctionnalité de recherche
   */
  const initSearch = () => {
    if (searchBox) {
      // Gestionnaire pour la soumission de recherche
      searchBox.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();

          const searchTerm = searchBox.value.trim();
          if (searchTerm) {
            performSearch(searchTerm);
          }
        }
      });
    }
  };

  /**
   * Effectue une recherche globale
   * @param {String} searchTerm - Terme de recherche
   */
  const performSearch = (searchTerm) => {
    // Récupération de la page active
    const activePage = document.querySelector(".page.active");

    if (activePage) {
      const pageId = activePage.id;
      const pageName = pageId.replace("-page", "");

      // Déclenchement d'un événement pour informer le module de page correspondant
      document.dispatchEvent(
        new CustomEvent("globalSearch", {
          detail: {
            page: pageName,
            searchTerm,
          },
        })
      );

      // Affichage d'une notification
      Notification.info(
        "Recherche en cours",
        `Recherche de "${searchTerm}" dans ${getPageTitle(pageName)}`
      );
    }
  };

  /**
   * Initialise la fonctionnalité de notifications
   */
  const initNotifications = () => {
    if (notificationsIcon) {
      notificationsIcon.addEventListener("click", () => {
        // Pour l'instant, on affiche juste une notification d'information
        // Dans le futur, on pourrait afficher un panneau de notifications
        Notification.info(
          "Notifications",
          "Vous n'avez pas de nouvelles notifications"
        );
      });
    }
  };

  /**
   * Initialise la fonctionnalité de profil utilisateur
   */
  const initUserProfile = () => {
    if (userProfile) {
      userProfile.addEventListener("click", () => {
        // Pour l'instant, on affiche juste une notification d'information
        // Dans le futur, on pourrait afficher un menu de profil utilisateur
        Notification.info(
          "Profil utilisateur",
          "Fonctionnalité en cours de développement"
        );
      });
    }
  };

  /**
   * Retourne le titre d'une page à partir de son nom
   * @param {String} pageName - Nom de la page
   * @returns {String} - Titre de la page
   */
  const getPageTitle = (pageName) => {
    const titles = {
      dashboard: "Tableau de bord",
      hotels: "Gestion des hôtels",
      parkings: "Gestion des parkings",
      spots: "Gestion des emplacements",
      status: "Gestion des statuts",
    };

    return titles[pageName] || "EasyPark";
  };

  // Exposition de l'API publique
  return {
    init,
    performSearch,
  };
})();

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", Header.init);

// Exportation pour utilisation dans les autres modules
window.Header = Header;
