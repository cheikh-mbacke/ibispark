import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { parkingService } from "../services/parkingService";

export const fetchParkings = createAsyncThunk(
  "parkings/fetchParkings",
  async ({ skip = 0, limit = 100 }, { rejectWithValue }) => {
    try {
      const response = await parkingService.getParkings(skip, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchParkingById = createAsyncThunk(
  "parkings/fetchParkingById",
  async (parkingId, { rejectWithValue }) => {
    try {
      const response = await parkingService.getParkingById(parkingId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createParking = createAsyncThunk(
  "parkings/createParking",
  async ({ hotelId, parkingData }, { rejectWithValue }) => {
    try {
      const response = await parkingService.createParking(hotelId, parkingData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateParking = createAsyncThunk(
  "parkings/updateParking",
  async ({ parkingId, parkingData }, { rejectWithValue }) => {
    try {
      const response = await parkingService.updateParking(
        parkingId,
        parkingData
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteParking = createAsyncThunk(
  "parkings/deleteParking",
  async (parkingId, { rejectWithValue }) => {
    try {
      await parkingService.deleteParking(parkingId);
      return parkingId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const parkingSlice = createSlice({
  name: "parkings",
  initialState: {
    items: [],
    currentParking: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetParkingState: (state) => {
      state.currentParking = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchParkings
      .addCase(fetchParkings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchParkings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchParkings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // fetchParkingById
      .addCase(fetchParkingById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchParkingById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentParking = action.payload;
      })
      .addCase(fetchParkingById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // createParking
      .addCase(createParking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createParking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createParking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // updateParking
      .addCase(updateParking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateParking.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (parking) => parking.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.currentParking = action.payload;
      })
      .addCase(updateParking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // deleteParking
      .addCase(deleteParking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteParking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(
          (parking) => parking.id !== action.payload
        );
        if (
          state.currentParking &&
          state.currentParking.id === action.payload
        ) {
          state.currentParking = null;
        }
      })
      .addCase(deleteParking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetParkingState } = parkingSlice.actions;
export default parkingSlice.reducer;
