import api from "./api";

export const hotelService = {
  // Récupérer tous les hôtels avec pagination
  getHotels: async (skip = 0, limit = 100) => {
    return await api.get(`/hotels`, { params: { skip, limit } });
  },

  // Récupérer un hôtel par son ID
  getHotelById: async (hotelId) => {
    return await api.get(`/hotels/${hotelId}`);
  },

  // Créer un nouvel hôtel
  createHotel: async (hotelData) => {
    return await api.post(`/hotels`, hotelData);
  },

  // Mettre à jour un hôtel existant
  updateHotel: async (hotelId, hotelData) => {
    return await api.put(`/hotels/${hotelId}`, hotelData);
  },

  // Supprimer un hôtel
  deleteHotel: async (hotelId) => {
    return await api.delete(`/hotels/${hotelId}`);
  },
};
