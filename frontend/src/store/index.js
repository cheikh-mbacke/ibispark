import { configureStore } from "@reduxjs/toolkit";
import hotelReducer from "./hotelSlice";
import parkingReducer from "./parkingSlice";
import spotReducer from "./spotSlice";
import statusReducer from "./statusSlice";
import typeReducer from "./typeSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    hotels: hotelReducer,
    parkings: parkingReducer,
    spots: spotReducer,
    statuses: statusReducer,
    types: typeReducer,
    auth: authReducer,
  },
});
