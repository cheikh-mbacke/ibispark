import { useDispatch, useSelector } from "react-redux";
import * as hotelActions from "../store/hotelSlice";
import * as parkingActions from "../store/parkingSlice";
import * as spotActions from "../store/spotSlice";
import * as statusActions from "../store/statusSlice";
import * as typeActions from "../store/typeSlice";
import { logout } from "../store/authSlice";

export const useReduxActions = () => {
  const dispatch = useDispatch();

  // Récupérer les données du store directement
  const hotels = useSelector((state) => state.hotels.items);
  const hotelsStatus = useSelector((state) => state.hotels.status);
  const hotelsError = useSelector((state) => state.hotels.error);
  const currentHotel = useSelector((state) => state.hotels.currentHotel);

  const parkings = useSelector((state) => state.parkings.items);
  const parkingsStatus = useSelector((state) => state.parkings.status);
  const parkingsError = useSelector((state) => state.parkings.error);
  const currentParking = useSelector((state) => state.parkings.currentParking);

  const spots = useSelector((state) => state.spots.items);
  const spotsStatus = useSelector((state) => state.spots.status);
  const spotsError = useSelector((state) => state.spots.error);
  const currentSpot = useSelector((state) => state.spots.currentSpot);
  const spotsByParking = useSelector((state) => state.spots.spotsByParking);

  const statuses = useSelector((state) => state.statuses.items);
  const statusesStatus = useSelector((state) => state.statuses.status);
  const statusesError = useSelector((state) => state.statuses.error);

  const types = useSelector((state) => state.types.items);
  const typesStatus = useSelector((state) => state.types.status);
  const typesError = useSelector((state) => state.types.error);

  const auth = useSelector((state) => state.auth);

  return {
    // Sélecteurs retournant directement les données
    selectors: {
      getHotels: () => hotels,
      getHotelById: (id) =>
        hotels.find((hotel) => hotel.id === id) || currentHotel,
      getHotelsStatus: () => hotelsStatus,
      getHotelsError: () => hotelsError,

      getParkings: () => parkings,
      getParkingById: (id) =>
        parkings.find((parking) => parking.id === id) || currentParking,
      getParkingsStatus: () => parkingsStatus,
      getParkingsError: () => parkingsError,

      getSpots: () => spots,
      getSpotById: (id) => spots.find((spot) => spot.id === id) || currentSpot,
      getSpotsByParkingId: (parkingId) => spotsByParking[parkingId] || [],
      getSpotsStatus: () => spotsStatus,
      getSpotsError: () => spotsError,

      getStatuses: () => statuses,
      getStatusesStatus: () => statusesStatus,
      getStatusesError: () => statusesError,

      getTypes: () => types,
      getTypesStatus: () => typesStatus,
      getTypesError: () => typesError,

      getAuth: () => auth,
    },

    // Actions
    actions: {
      // Hotels
      fetchHotels: (params) => dispatch(hotelActions.fetchHotels(params)),
      fetchHotelById: (id) => dispatch(hotelActions.fetchHotelById(id)),
      createHotel: (data) => dispatch(hotelActions.createHotel(data)),
      updateHotel: (id, data) =>
        dispatch(hotelActions.updateHotel({ hotelId: id, hotelData: data })),
      deleteHotel: (id) => dispatch(hotelActions.deleteHotel(id)),
      resetHotelState: () => dispatch(hotelActions.resetHotelState()),

      // Parkings
      fetchParkings: (params) => dispatch(parkingActions.fetchParkings(params)),
      fetchParkingById: (id) => dispatch(parkingActions.fetchParkingById(id)),
      createParking: (hotelId, data) =>
        dispatch(parkingActions.createParking({ hotelId, parkingData: data })),
      updateParking: (id, data) =>
        dispatch(
          parkingActions.updateParking({ parkingId: id, parkingData: data })
        ),
      deleteParking: (id) => dispatch(parkingActions.deleteParking(id)),
      resetParkingState: () => dispatch(parkingActions.resetParkingState()),

      // Spots
      fetchSpots: (params) => dispatch(spotActions.fetchSpots(params)),
      fetchSpotById: (id) => dispatch(spotActions.fetchSpotById(id)),
      fetchSpotsByParkingId: (parkingId) =>
        dispatch(spotActions.fetchSpotsByParkingId(parkingId)),
      createSpot: (parkingId, data) =>
        dispatch(spotActions.createSpot({ parkingId, spotData: data })),
      updateSpot: (id, data) =>
        dispatch(spotActions.updateSpot({ spotId: id, spotData: data })),
      deleteSpot: (id) => dispatch(spotActions.deleteSpot(id)),
      resetSpotState: () => dispatch(spotActions.resetSpotState()),

      // Statuses
      fetchStatuses: () => dispatch(statusActions.fetchStatuses()),
      addStatusToSpot: (spotId, statusData) =>
        dispatch(statusActions.addStatusToSpot({ spotId, statusData })),
      removeStatusFromSpot: (spotId, statusId) =>
        dispatch(statusActions.removeStatusFromSpot({ spotId, statusId })),

      // Types
      fetchTypes: () => dispatch(typeActions.fetchTypes()),

      // Auth
      logout: () => dispatch(logout()),
    },
  };
};
