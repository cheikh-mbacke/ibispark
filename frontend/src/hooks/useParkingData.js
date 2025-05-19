import { useState, useEffect, useMemo } from "react";
import { useApiCallManager } from "./useApiCallManager";

/**
 * Hook personnalisé pour récupérer et traiter les données liées au parking
 * @returns {Object} Données et statistiques des parkings
 */
export const useParkingData = () => {
  // Utilise le hook useApiCallManager pour gérer les appels API
  const {
    loading: apiLoading,
    error: apiError,
    selectors,
  } = useApiCallManager();

  // Récupérer les données du Redux store
  const hotels = selectors.getHotels();
  const parkings = selectors.getParkings();
  const spots = selectors.getSpots();
  const statuses = selectors.getStatuses();
  const types = selectors.getTypes();

  // État de chargement global
  const isLoading =
    selectors.getHotelsStatus() === "loading" ||
    selectors.getParkingsStatus() === "loading" ||
    selectors.getSpotsStatus() === "loading" ||
    selectors.getStatusesStatus() === "loading" ||
    selectors.getTypesStatus() === "loading";

  // Erreurs éventuelles
  const fetchError =
    selectors.getHotelsError() ||
    selectors.getParkingsError() ||
    selectors.getSpotsError() ||
    selectors.getStatusesError() ||
    selectors.getTypesError();

  // Calculer les statistiques globales - uniquement les données réelles de l'API
  const statistics = useMemo(() => {
    // Total d'hôtels, parkings, et emplacements
    const totalHotels = hotels.length;
    const totalParkings = parkings.length;
    const totalSpots = spots.length;
    const totalStatuses = statuses.length;
    const totalTypes = types.length;

    console.log("Calcul des statistiques réelles depuis l'API:");
    console.log("- totalHotels:", totalHotels);
    console.log("- totalParkings:", totalParkings);
    console.log("- totalSpots:", totalSpots);
    console.log("- totalStatuses:", totalStatuses);
    console.log("- totalTypes:", totalTypes);

    // Enrichir les données des hôtels avec des informations sur leurs parkings et emplacements
    const hotelsWithDetails = hotels.map((hotel) => {
      // Trouver les parkings associés à cet hôtel
      const hotelParkings = parkings.filter((p) => p.hotel_id === hotel.id);

      // Compter les emplacements pour ces parkings
      let spotCount = 0;
      hotelParkings.forEach((parking) => {
        const parkingSpots = spots.filter((s) => s.parking_id === parking.id);
        spotCount += parkingSpots.length;
      });

      return {
        ...hotel,
        parkingCount: hotelParkings.length,
        spotCount,
      };
    });

    return {
      totalHotels,
      totalParkings,
      totalSpots,
      totalStatuses,
      totalTypes,
      hotels: hotelsWithDetails,
      parkings,
      spots,
      statuses,
      types,
    };
  }, [hotels, parkings, spots, statuses, types]);

  return {
    statistics,
    loading: apiLoading || isLoading,
    error: apiError || fetchError,
  };
};

export default useParkingData;
