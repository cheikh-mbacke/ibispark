import api from "./api";

export const spotService = {
  // Récupérer tous les spots avec pagination
  getSpots: async (skip = 0, limit = 100) => {
    return await api.get(`/spots`, { params: { skip, limit } });
  },

  // Récupérer un spot par son ID
  getSpotById: async (spotId) => {
    return await api.get(`/spots/${spotId}`);
  },

  // Récupérer les spots d'un parking spécifique
  getSpotsByParkingId: async (parkingId) => {
    return await api.get(`/parkings/${parkingId}/spots`);
  },

  // Créer un nouveau spot pour un parking
  createSpot: async (parkingId, spotData) => {
    return await api.post(`/parkings/${parkingId}/spots`, spotData);
  },

  // Mettre à jour un spot existant
  updateSpot: async (spotId, spotData) => {
    return await api.put(`/spots/${spotId}`, spotData);
  },

  // Supprimer un spot
  deleteSpot: async (spotId) => {
    return await api.delete(`/spots/${spotId}`);
  },
};
