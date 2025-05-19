import api from "./api";

export const parkingService = {
  // Récupérer tous les parkings avec pagination
  getParkings: async (skip = 0, limit = 100) => {
    return await api.get(`/parkings`, { params: { skip, limit } });
  },

  // Récupérer un parking par son ID
  getParkingById: async (parkingId) => {
    return await api.get(`/parkings/${parkingId}`);
  },

  // Récupérer les parkings d'un hôtel spécifique
  getParkingsByHotelId: async (hotelId) => {
    return await api.get(`/hotels/${hotelId}/parkings`);
  },

  // Créer un nouveau parking pour un hôtel
  createParking: async (hotelId, parkingData) => {
    return await api.post(`/hotels/${hotelId}/parkings`, parkingData);
  },

  // Mettre à jour un parking existant
  updateParking: async (parkingId, parkingData) => {
    return await api.put(`/parkings/${parkingId}`, parkingData);
  },

  // Supprimer un parking
  deleteParking: async (parkingId) => {
    return await api.delete(`/parkings/${parkingId}`);
  },
};
