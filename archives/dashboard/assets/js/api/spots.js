/**
 * spots.js - Module API pour la gestion des emplacements de parking
 * Fournit les méthodes pour interagir avec l'API des emplacements
 */

const SpotsAPI = (function () {
  // Endpoint de base pour les emplacements
  const ENDPOINT = "/spots";

  /**
   * Récupère tous les emplacements
   * @param {Object} params - Paramètres de pagination (skip, limit)
   * @returns {Promise} - Promise avec la liste des emplacements
   */
  const getAllSpots = (params = {}) => {
    return API.get(ENDPOINT, params);
  };

  /**
   * Récupère un emplacement par son ID
   * @param {Number} id - ID de l'emplacement
   * @returns {Promise} - Promise avec les détails de l'emplacement
   */
  const getSpotById = (id) => {
    return API.get(`${ENDPOINT}/${id}`);
  };

  /**
   * Crée un nouvel emplacement pour un parking
   * @param {Number} parkingId - ID du parking
   * @param {Object} spotData - Données de l'emplacement
   * @returns {Promise} - Promise avec l'emplacement créé
   */
  const createSpot = (parkingId, spotData) => {
    return API.post(`/parkings/${parkingId}/spots`, spotData);
  };

  /**
   * Met à jour un emplacement existant
   * @param {Number} id - ID de l'emplacement
   * @param {Object} spotData - Données de l'emplacement à mettre à jour
   * @returns {Promise} - Promise avec l'emplacement mis à jour
   */
  const updateSpot = (id, spotData) => {
    return API.put(`${ENDPOINT}/${id}`, spotData);
  };

  /**
   * Supprime un emplacement
   * @param {Number} id - ID de l'emplacement
   * @returns {Promise} - Promise avec le résultat de la suppression
   */
  const deleteSpot = (id) => {
    return API.delete(`${ENDPOINT}/${id}`);
  };

  /**
   * Ajoute un statut à un emplacement
   * @param {Number} spotId - ID de l'emplacement
   * @param {Object} statusData - Données du statut
   * @returns {Promise} - Promise avec l'emplacement mis à jour
   */
  const addStatusToSpot = (spotId, statusData) => {
    return API.post(`${ENDPOINT}/${spotId}/statuses`, statusData);
  };

  /**
   * Retire un statut d'un emplacement
   * @param {Number} spotId - ID de l'emplacement
   * @param {Number} statusId - ID du statut
   * @returns {Promise} - Promise avec l'emplacement mis à jour
   */
  const removeStatusFromSpot = (spotId, statusId) => {
    return API.delete(`${ENDPOINT}/${spotId}/statuses/${statusId}`);
  };

  // Exposition de l'API publique
  return {
    getAllSpots,
    getSpotById,
    createSpot,
    updateSpot,
    deleteSpot,
    addStatusToSpot,
    removeStatusFromSpot,
  };
})();

// Exportation pour utilisation dans les autres modules
window.SpotsAPI = SpotsAPI;
