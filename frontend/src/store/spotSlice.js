import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spotService } from "../services/spotService";

export const fetchSpots = createAsyncThunk(
  "spots/fetchSpots",
  async (params = {}, { rejectWithValue }) => {
    try {
      // Assurer que skip et limit sont définis avec des valeurs par défaut
      const skip = params?.skip ?? 0;
      const limit = params?.limit ?? 100;

      const response = await spotService.getSpots(skip, limit);
      return response;
    } catch (error) {
      console.error("Error fetching spots:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSpotById = createAsyncThunk(
  "spots/fetchSpotById",
  async (spotId, { rejectWithValue }) => {
    try {
      const response = await spotService.getSpotById(spotId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSpotsByParkingId = createAsyncThunk(
  "spots/fetchSpotsByParkingId",
  async (parkingId, { rejectWithValue }) => {
    try {
      const response = await spotService.getSpotsByParkingId(parkingId);
      return { parkingId, spots: response };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSpot = createAsyncThunk(
  "spots/createSpot",
  async ({ parkingId, spotData }, { rejectWithValue }) => {
    try {
      const response = await spotService.createSpot(parkingId, spotData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSpot = createAsyncThunk(
  "spots/updateSpot",
  async ({ spotId, spotData }, { rejectWithValue }) => {
    try {
      const response = await spotService.updateSpot(spotId, spotData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteSpot = createAsyncThunk(
  "spots/deleteSpot",
  async (spotId, { rejectWithValue }) => {
    try {
      await spotService.deleteSpot(spotId);
      return spotId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const spotSlice = createSlice({
  name: "spots",
  initialState: {
    items: [],
    currentSpot: null,
    spotsByParking: {},
    status: "idle",
    error: null,
  },
  reducers: {
    resetSpotState: (state) => {
      state.currentSpot = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSpots
      .addCase(fetchSpots.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSpots.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchSpots.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // fetchSpotById
      .addCase(fetchSpotById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSpotById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentSpot = action.payload;
        state.error = null;
      })
      .addCase(fetchSpotById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // fetchSpotsByParkingId
      .addCase(fetchSpotsByParkingId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSpotsByParkingId.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Utilisez l'ID du parking comme clé pour stocker les spots associés
        state.spotsByParking[action.payload.parkingId] = action.payload.spots;
        state.error = null;
      })
      .addCase(fetchSpotsByParkingId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // createSpot
      .addCase(createSpot.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSpot.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
        // Mise à jour des spots par parking si nécessaire
        const parkingId = action.meta.arg.parkingId;
        if (state.spotsByParking[parkingId]) {
          state.spotsByParking[parkingId].push(action.payload);
        }
        state.error = null;
      })
      .addCase(createSpot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // updateSpot
      .addCase(updateSpot.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSpot.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Mise à jour dans la liste globale
        const index = state.items.findIndex(
          (spot) => spot.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }

        // Mise à jour dans spotsByParking si présent
        if (
          action.payload.parking_id &&
          state.spotsByParking[action.payload.parking_id]
        ) {
          const parkingSpots = state.spotsByParking[action.payload.parking_id];
          const spotIndex = parkingSpots.findIndex(
            (spot) => spot.id === action.payload.id
          );
          if (spotIndex !== -1) {
            parkingSpots[spotIndex] = action.payload;
          }
        }

        state.currentSpot = action.payload;
        state.error = null;
      })
      .addCase(updateSpot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // deleteSpot
      .addCase(deleteSpot.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSpot.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Suppression de la liste globale
        state.items = state.items.filter((spot) => spot.id !== action.payload);

        // Suppression des spotsByParking
        Object.keys(state.spotsByParking).forEach((parkingId) => {
          state.spotsByParking[parkingId] = state.spotsByParking[
            parkingId
          ].filter((spot) => spot.id !== action.payload);
        });

        if (state.currentSpot && state.currentSpot.id === action.payload) {
          state.currentSpot = null;
        }
        state.error = null;
      })
      .addCase(deleteSpot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetSpotState } = spotSlice.actions;
export default spotSlice.reducer;
