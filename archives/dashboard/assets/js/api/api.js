/**
 * api.js - Module API principal
 * Fournit les méthodes de base pour interagir avec l'API
 */

const API = (function () {
  // URL de base de l'API
  const BASE_URL = CONFIG.API.BASE_URL;

  /**
   * Effectue une requête HTTP vers l'API
   * @param {String} endpoint - L'endpoint à appeler
   * @param {Object} options - Options de la requête
   * @returns {Promise} - Promise avec la réponse JSON
   */
  const request = async (endpoint, options = {}) => {
    try {
      // Affichage du loader
      showLoader();

      // Préparation des options par défaut
      const defaultOptions = {
        headers: CONFIG.API.HEADERS,
        timeout: CONFIG.API.TIMEOUT,
      };

      // Fusion des options
      const fetchOptions = { ...defaultOptions, ...options };

      // Construction de l'URL complète
      const url = `${BASE_URL}${endpoint}`;

      // Ajout d'un timeout à la requête
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        CONFIG.API.TIMEOUT
      );
      fetchOptions.signal = controller.signal;

      // Exécution de la requête
      const response = await fetch(url, fetchOptions);

      // Annulation du timeout
      clearTimeout(timeoutId);

      // Vérification de la réponse
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || CONFIG.TEXT.ERROR_MESSAGE);
      }

      // Extraction des données JSON
      const data = await response.json();

      // Masquage du loader
      hideLoader();

      return data;
    } catch (error) {
      // Masquage du loader
      hideLoader();

      // Gestion des erreurs réseau
      if (error.name === "AbortError") {
        throw new Error("La requête a pris trop de temps. Veuillez réessayer.");
      }

      // Gestion des erreurs d'expiration de session
      if (
        error.message.includes("expired") ||
        error.message.includes("token")
      ) {
        // Redirection vers la page de connexion (à implémenter)
        console.error("Session expirée", error);
        throw new Error(CONFIG.TEXT.SESSION_EXPIRED);
      }

      // Propagation de l'erreur
      console.error("Erreur API:", error);
      throw error;
    }
  };

  /**
   * Effectue une requête GET
   * @param {String} endpoint - L'endpoint à appeler
   * @param {Object} params - Paramètres de la requête
   * @returns {Promise} - Promise avec la réponse JSON
   */
  const get = (endpoint, params = {}) => {
    // Construction de la chaîne de requête
    const queryString = Object.keys(params).length
      ? "?" + new URLSearchParams(params).toString()
      : "";

    return request(`${endpoint}${queryString}`, { method: "GET" });
  };

  /**
   * Effectue une requête POST
   * @param {String} endpoint - L'endpoint à appeler
   * @param {Object} data - Données à envoyer
   * @returns {Promise} - Promise avec la réponse JSON
   */
  const post = (endpoint, data = {}) => {
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  /**
   * Effectue une requête PUT
   * @param {String} endpoint - L'endpoint à appeler
   * @param {Object} data - Données à envoyer
   * @returns {Promise} - Promise avec la réponse JSON
   */
  const put = (endpoint, data = {}) => {
    return request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };

  /**
   * Effectue une requête DELETE
   * @param {String} endpoint - L'endpoint à appeler
   * @returns {Promise} - Promise avec la réponse JSON
   */
  const remove = (endpoint) => {
    return request(endpoint, { method: "DELETE" });
  };

  /**
   * Affiche le loader global
   */
  const showLoader = () => {
    document.getElementById("loading-overlay").classList.add("active");
  };

  /**
   * Masque le loader global
   */
  const hideLoader = () => {
    document.getElementById("loading-overlay").classList.remove("active");
  };

  // Exposition de l'API publique
  return {
    get,
    post,
    put,
    delete: remove,
    request,
    showLoader,
    hideLoader,
  };
})();

// Exportation pour utilisation dans les autres modules
window.API = API;
