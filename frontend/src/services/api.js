import axios from "axios";

// Création d'une instance axios avec la configuration de base
const api = axios.create({
  baseURL: "http://localhost:8000/api", // URL corrigée pour correspondre à celle utilisée dans les tests curl
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token d'authentification si disponible
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    // Gestion des erreurs 401 (non autorisé) - redirection vers la page de connexion
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
