/**
 * storage.js - Module utilitaire pour la gestion du stockage local
 * Fournit des méthodes pour interagir avec le localStorage et le sessionStorage
 */

const Storage = (function () {
  // Préfixe pour toutes les clés de stockage
  const KEY_PREFIX = "easypark_";

  /**
   * Enregistre une valeur dans le localStorage
   * @param {String} key - Clé de stockage
   * @param {*} value - Valeur à stocker (sera convertie en JSON)
   */
  const setItem = (key, value) => {
    try {
      const prefixedKey = KEY_PREFIX + key;
      const serializedValue = JSON.stringify(value);

      localStorage.setItem(prefixedKey, serializedValue);
      return true;
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement dans le localStorage:",
        error
      );
      return false;
    }
  };

  /**
   * Récupère une valeur depuis le localStorage
   * @param {String} key - Clé de stockage
   * @param {*} defaultValue - Valeur par défaut si la clé n'existe pas
   * @returns {*} - Valeur récupérée (désérialisée depuis JSON)
   */
  const getItem = (key, defaultValue = null) => {
    try {
      const prefixedKey = KEY_PREFIX + key;
      const serializedValue = localStorage.getItem(prefixedKey);

      if (serializedValue === null) return defaultValue;

      return JSON.parse(serializedValue);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération depuis le localStorage:",
        error
      );
      return defaultValue;
    }
  };

  /**
   * Supprime une valeur du localStorage
   * @param {String} key - Clé de stockage
   */
  const removeItem = (key) => {
    try {
      const prefixedKey = KEY_PREFIX + key;
      localStorage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error(
        "Erreur lors de la suppression depuis le localStorage:",
        error
      );
      return false;
    }
  };

  /**
   * Vérifie si une clé existe dans le localStorage
   * @param {String} key - Clé de stockage
   * @returns {Boolean} - true si la clé existe
   */
  const hasItem = (key) => {
    const prefixedKey = KEY_PREFIX + key;
    return localStorage.getItem(prefixedKey) !== null;
  };

  /**
   * Enregistre une valeur dans le sessionStorage
   * @param {String} key - Clé de stockage
   * @param {*} value - Valeur à stocker (sera convertie en JSON)
   */
  const setSessionItem = (key, value) => {
    try {
      const prefixedKey = KEY_PREFIX + key;
      const serializedValue = JSON.stringify(value);

      sessionStorage.setItem(prefixedKey, serializedValue);
      return true;
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement dans le sessionStorage:",
        error
      );
      return false;
    }
  };

  /**
   * Récupère une valeur depuis le sessionStorage
   * @param {String} key - Clé de stockage
   * @param {*} defaultValue - Valeur par défaut si la clé n'existe pas
   * @returns {*} - Valeur récupérée (désérialisée depuis JSON)
   */
  const getSessionItem = (key, defaultValue = null) => {
    try {
      const prefixedKey = KEY_PREFIX + key;
      const serializedValue = sessionStorage.getItem(prefixedKey);

      if (serializedValue === null) return defaultValue;

      return JSON.parse(serializedValue);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération depuis le sessionStorage:",
        error
      );
      return defaultValue;
    }
  };

  /**
   * Supprime une valeur du sessionStorage
   * @param {String} key - Clé de stockage
   */
  const removeSessionItem = (key) => {
    try {
      const prefixedKey = KEY_PREFIX + key;
      sessionStorage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error(
        "Erreur lors de la suppression depuis le sessionStorage:",
        error
      );
      return false;
    }
  };

  /**
   * Enregistre les préférences utilisateur
   * @param {Object} preferences - Préférences à enregistrer
   */
  const saveUserPreferences = (preferences) => {
    return setItem("user_preferences", preferences);
  };

  /**
   * Récupère les préférences utilisateur
   * @returns {Object} - Préférences utilisateur
   */
  const getUserPreferences = () => {
    return getItem("user_preferences", {});
  };

  /**
   * Enregistre l'état des filtres pour une page
   * @param {String} pageName - Nom de la page
   * @param {Object} filters - Filtres à enregistrer
   */
  const saveFilters = (pageName, filters) => {
    return setItem(`filters_${pageName}`, filters);
  };

  /**
   * Récupère l'état des filtres pour une page
   * @param {String} pageName - Nom de la page
   * @returns {Object} - Filtres enregistrés
   */
  const getFilters = (pageName) => {
    return getItem(`filters_${pageName}`, {});
  };

  // Exposition de l'API publique
  return {
    setItem,
    getItem,
    removeItem,
    hasItem,
    setSessionItem,
    getSessionItem,
    removeSessionItem,
    saveUserPreferences,
    getUserPreferences,
    saveFilters,
    getFilters,
  };
})();

// Exportation pour utilisation dans les autres modules
window.Storage = Storage;
