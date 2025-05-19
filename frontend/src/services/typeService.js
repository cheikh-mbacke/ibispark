import api from "./api";

export const typeService = {
  // Récupérer tous les types disponibles
  getTypes: async () => {
    return await api.get(`/types`);
  },
};
