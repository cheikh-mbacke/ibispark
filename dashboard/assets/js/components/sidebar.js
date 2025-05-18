/**
 * sidebar.js - Module pour la gestion de la barre latérale
 * Gère le comportement de la barre latérale et la navigation
 */

const Sidebar = (function () {
  // Éléments DOM
  let sidebarElement;
  let sidebarToggleBtn;
  let navLinks;
  let container;

  /**
   * Initialise la barre latérale
   */
  const init = () => {
    // Récupération des éléments DOM
    sidebarElement = document.querySelector(".sidebar");
    sidebarToggleBtn = document.getElementById("sidebar-toggle");
    navLinks = document.querySelectorAll(".sidebar-nav a");
    container = document.querySelector(".container");

    // Gestion du toggle de la sidebar
    sidebarToggleBtn.addEventListener("click", toggleSidebar);

    // Gestion des liens de navigation
    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavigation);
    });

    // Restauration de l'état de la sidebar depuis le stockage local
    const isSidebarCollapsed = Storage.getItem("sidebar_collapsed", false);
    if (isSidebarCollapsed) {
      container.classList.add("sidebar-collapsed");
    }

    // Restauration de la page active depuis le stockage local ou l'URL
    const currentPage = getCurrentPageFromUrlOrStorage();
    if (currentPage) {
      activatePage(currentPage);
    }

    // Gestion des événements de redimensionnement
    window.addEventListener("resize", handleResize);

    // Initialisation initiale pour les petits écrans
    handleResize();
  };

  /**
   * Active/désactive le mode compacté de la barre latérale
   */
  const toggleSidebar = () => {
    container.classList.toggle("sidebar-collapsed");

    // Enregistrement de l'état dans le stockage local
    Storage.setItem(
      "sidebar_collapsed",
      container.classList.contains("sidebar-collapsed")
    );
  };

  /**
   * Gère la navigation entre les pages
   * @param {Event} event - Événement de clic
   */
  const handleNavigation = (event) => {
    event.preventDefault();

    const link = event.currentTarget;
    const pageName = link.getAttribute("data-page");

    if (pageName) {
      activatePage(pageName);

      // Enregistrement de la page active dans le stockage local
      Storage.setItem("active_page", pageName);

      // Fermeture automatique de la sidebar sur mobile
      if (window.innerWidth <= 768) {
        container.classList.add("sidebar-collapsed");
      }
    }
  };

  /**
   * Active une page spécifique
   * @param {String} pageName - Nom de la page à activer
   */
  const activatePage = (pageName) => {
    // Mise à jour des liens de navigation
    navLinks.forEach((link) => {
      const linkPage = link.getAttribute("data-page");

      if (linkPage === pageName) {
        link.parentElement.classList.add("active");
      } else {
        link.parentElement.classList.remove("active");
      }
    });

    // Mise à jour du titre de la page
    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
      pageTitle.textContent = getPageTitle(pageName);
    }

    // Affichage de la page correspondante
    const pages = document.querySelectorAll(".page");
    pages.forEach((page) => {
      if (page.id === `${pageName}-page`) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });

    // Déclenchement d'un événement pour informer les autres modules
    document.dispatchEvent(
      new CustomEvent("pageChanged", { detail: { page: pageName } })
    );
  };

  /**
   * Détermine la page active à partir de l'URL ou du stockage local
   * @returns {String} - Nom de la page active
   */
  const getCurrentPageFromUrlOrStorage = () => {
    // Tentative de récupération depuis l'URL (hash)
    const hash = window.location.hash.substring(1);
    if (hash) {
      return hash;
    }

    // Sinon, récupération depuis le stockage local
    return Storage.getItem("active_page", "dashboard");
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

  /**
   * Gère le comportement de la sidebar lors du redimensionnement de la fenêtre
   */
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      // Sur mobile, la sidebar est toujours compactée par défaut
      container.classList.add("sidebar-collapsed");
    } else {
      // Sur desktop, restauration de l'état enregistré
      const isSidebarCollapsed = Storage.getItem("sidebar_collapsed", false);
      if (isSidebarCollapsed) {
        container.classList.add("sidebar-collapsed");
      } else {
        container.classList.remove("sidebar-collapsed");
      }
    }
  };

  // Exposition de l'API publique
  return {
    init,
    activatePage,
    toggleSidebar,
  };
})();

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", Sidebar.init);

// Exportation pour utilisation dans les autres modules
window.Sidebar = Sidebar;
