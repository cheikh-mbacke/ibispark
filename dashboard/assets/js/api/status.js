/**
 * status.js - Module API pour la gestion des statuts
 * Fournit les méthodes pour interagir avec l'API des statuts
 */

const StatusAPI = (function () {
  // Endpoint de base pour les statuts
  const ENDPOINT = "/statuses";

  /**
   * Récupère tous les statuts disponibles
   * @param {Object} params - Paramètres de pagination (skip, limit)
   * @returns {Promise} - Promise avec la liste des statuts
   */
  const getAllStatuses = (params = {}) => {
    return API.get(ENDPOINT, params);
  };

  /**
   * Récupère tous les types d'emplacement disponibles
   * @param {Object} params - Paramètres de pagination (skip, limit)
   * @returns {Promise} - Promise avec la liste des types
   */
  const getAllTypes = (params = {}) => {
    return API.get("/types", params);
  };

  // Exposition de l'API publique
  return {
    getAllStatuses,
    getAllTypes,
  };
})();

// Exportation pour utilisation dans les autres modules
window.StatusAPI = StatusAPI;
