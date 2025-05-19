import { useReduxActions } from "./useReduxActions";
import { useState, useEffect } from "react";

/**
 * Hook pour gérer les appels à l'API dans useParkingData
 */
export const useApiCallManager = () => {
  const { actions, selectors } = useReduxActions();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les données au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Début du chargement des données...");

        // Récupérer toutes les données en parallèle
        // IMPORTANT: Passer un objet vide {} au lieu de undefined pour les paramètres
        const results = await Promise.all([
          actions.fetchHotels({}),
          actions.fetchParkings({}),
          actions.fetchSpots({}),
          actions.fetchStatuses(),
          actions.fetchTypes(),
        ]);

        console.log("Résultats des appels API:", results);

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(
          err.message ||
            "Une erreur est survenue lors du chargement des données"
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    loading,
    error,
    selectors,
  };
};

export default useApiCallManager;
