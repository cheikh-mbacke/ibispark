/**
 * parkings.js - Module API pour la gestion des parkings
 * Fournit les méthodes pour interagir avec l'API des parkings
 */

const ParkingsAPI = (function () {
  // Endpoint de base pour les parkings
  const ENDPOINT = "/parkings";

  /**
   * Récupère tous les parkings
   * @param {Object} params - Paramètres de pagination (skip, limit)
   * @returns {Promise} - Promise avec la liste des parkings
   */
  const getAllParkings = (params = {}) => {
    return API.get(ENDPOINT, params);
  };

  /**
   * Récupère un parking par son ID
   * @param {Number} id - ID du parking
   * @returns {Promise} - Promise avec les détails du parking
   */
  const getParkingById = (id) => {
    return API.get(`${ENDPOINT}/${id}`);
  };

  /**
   * Crée un nouveau parking pour un hôtel
   * @param {Number} hotelId - ID de l'hôtel
   * @param {Object} parkingData - Données du parking
   * @returns {Promise} - Promise avec le parking créé
   */
  const createParking = (hotelId, parkingData) => {
    return API.post(`/hotels/${hotelId}/parkings`, parkingData);
  };

  /**
   * Met à jour un parking existant
   * @param {Number} id - ID du parking
   * @param {Object} parkingData - Données du parking à mettre à jour
   * @returns {Promise} - Promise avec le parking mis à jour
   */
  const updateParking = (id, parkingData) => {
    return API.put(`${ENDPOINT}/${id}`, parkingData);
  };

  /**
   * Supprime un parking
   * @param {Number} id - ID du parking
   * @returns {Promise} - Promise avec le résultat de la suppression
   */
  const deleteParking = (id) => {
    return API.delete(`${ENDPOINT}/${id}`);
  };

  /**
   * Récupère tous les emplacements d'un parking
   * @param {Number} parkingId - ID du parking
   * @param {Object} params - Paramètres de pagination (skip, limit)
   * @returns {Promise} - Promise avec la liste des emplacements du parking
   */
  const getParkingSpots = (parkingId, params = {}) => {
    return API.get(`${ENDPOINT}/${parkingId}/spots`, params);
  };

  // Exposition de l'API publique
  return {
    getAllParkings,
    getParkingById,
    createParking,
    updateParking,
    deleteParking,
    getParkingSpots,
  };
})();

// Exportation pour utilisation dans les autres modules
window.ParkingsAPI = ParkingsAPI;
