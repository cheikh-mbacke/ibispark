/**
 * hotels.js - Module API pour la gestion des hôtels
 * Fournit les méthodes pour interagir avec l'API des hôtels
 */

const HotelsAPI = (function () {
  // Endpoint de base pour les hôtels
  const ENDPOINT = "/hotels";

  /**
   * Récupère tous les hôtels
   * @param {Object} params - Paramètres de pagination (skip, limit)
   * @returns {Promise} - Promise avec la liste des hôtels
   */
  const getAllHotels = (params = {}) => {
    return API.get(ENDPOINT, params);
  };

  /**
   * Récupère un hôtel par son ID
   * @param {Number} id - ID de l'hôtel
   * @returns {Promise} - Promise avec les détails de l'hôtel
   */
  const getHotelById = (id) => {
    return API.get(`${ENDPOINT}/${id}`);
  };

  /**
   * Crée un nouvel hôtel
   * @param {Object} hotelData - Données de l'hôtel
   * @returns {Promise} - Promise avec l'hôtel créé
   */
  const createHotel = (hotelData) => {
    return API.post(ENDPOINT, hotelData);
  };

  /**
   * Met à jour un hôtel existant
   * @param {Number} id - ID de l'hôtel
   * @param {Object} hotelData - Données de l'hôtel à mettre à jour
   * @returns {Promise} - Promise avec l'hôtel mis à jour
   */
  const updateHotel = (id, hotelData) => {
    return API.put(`${ENDPOINT}/${id}`, hotelData);
  };

  /**
   * Supprime un hôtel
   * @param {Number} id - ID de l'hôtel
   * @returns {Promise} - Promise avec le résultat de la suppression
   */
  const deleteHotel = (id) => {
    return API.delete(`${ENDPOINT}/${id}`);
  };

  /**
   * Récupère tous les parkings d'un hôtel
   * @param {Number} hotelId - ID de l'hôtel
   * @param {Object} params - Paramètres de pagination (skip, limit)
   * @returns {Promise} - Promise avec la liste des parkings de l'hôtel
   */
  const getHotelParkings = (hotelId, params = {}) => {
    return API.get(`${ENDPOINT}/${hotelId}/parkings`, params);
  };

  // Exposition de l'API publique
  return {
    getAllHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
    getHotelParkings,
  };
})();

// Exportation pour utilisation dans les autres modules
window.HotelsAPI = HotelsAPI;
