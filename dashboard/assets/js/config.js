/**
 * config.js - Configuration de l'application
 * Centralise les paramètres globaux de l'application
 */

const CONFIG = {
  // Configuration API
  API: {
    BASE_URL: "http://localhost:8000/api", // URL de base de l'API
    TIMEOUT: 30000, // Timeout des requêtes en ms
    HEADERS: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },

  // Configuration de l'interface
  UI: {
    TOAST_DURATION: 5000, // Durée d'affichage des notifications en ms
    ANIMATION_DURATION: 300, // Durée des animations en ms
    DATE_FORMAT: "DD/MM/YYYY", // Format de date par défaut
    TIME_FORMAT: "HH:mm", // Format d'heure par défaut
    ITEMS_PER_PAGE: 10, // Nombre d'éléments par page dans les tableaux
  },

  // Textes par défaut
  TEXT: {
    ERROR_MESSAGE: "Une erreur est survenue. Veuillez réessayer.",
    NETWORK_ERROR:
      "Erreur de connexion au serveur. Vérifiez votre connexion Internet.",
    SESSION_EXPIRED: "Votre session a expiré. Veuillez vous reconnecter.",
    CONFIRM_DELETE:
      "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.",
    LOADING: "Chargement en cours...",
  },

  // Status des places de parking
  PARKING_STATUS: {
    PERSONNEL: { value: "personnel", color: "#F4CCCC", label: "Personnel" },
    LATE_CHECKOUT: {
      value: "late_checkout",
      color: "#FF9900",
      label: "Départ tardif",
    },
    ARRIVAL_TODAY: {
      value: "arrival_today",
      color: "#00FF00",
      label: "Arrivée aujourd'hui",
    },
    ALREADY_IN: {
      value: "already_in",
      color: "#D9A384",
      label: "Déjà présent",
    },
    CONTACT_HOTEL: {
      value: "contact_hotel",
      color: "#FF00FF",
      label: "Contacter l'hôtel",
    },
    EXTERNAL_COMPANY: {
      value: "external_company",
      color: "#FFFF00",
      label: "Société externe",
    },
    UNKNOWN_OCCUPATION: {
      value: "unknown_occupation",
      color: "#FF0000",
      label: "Occupation inconnue",
    },
  },

  // Types d'emplacements
  SPOT_TYPES: {
    PMR: { value: "PMR", label: "PMR" },
    STANDARD: { value: "STANDARD", label: "Standard" },
  },

  // Permissions utilisateur (pour une future implémentation)
  PERMISSIONS: {
    VIEW_HOTELS: "view_hotels",
    EDIT_HOTELS: "edit_hotels",
    DELETE_HOTELS: "delete_hotels",
    VIEW_PARKINGS: "view_parkings",
    EDIT_PARKINGS: "edit_parkings",
    DELETE_PARKINGS: "delete_parkings",
    VIEW_SPOTS: "view_spots",
    EDIT_SPOTS: "edit_spots",
    DELETE_SPOTS: "delete_spots",
    ADMIN: "admin",
  },
};

// Exportation pour utilisation dans les autres modules
window.CONFIG = CONFIG;
