import api from "./api";

export const statusService = {
  // Récupérer tous les statuts disponibles
  getStatuses: async () => {
    return await api.get(`/statuses`);
  },

  // Ajouter un statut à un spot
  addStatusToSpot: async (spotId, statusData) => {
    return await api.post(`/spots/${spotId}/statuses`, statusData);
  },

  // Supprimer un statut d'un spot
  removeStatusFromSpot: async (spotId, statusId) => {
    return await api.delete(`/spots/${spotId}/statuses/${statusId}`);
  },
};
