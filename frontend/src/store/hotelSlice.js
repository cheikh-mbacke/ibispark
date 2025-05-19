import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { hotelService } from "../services/hotelService";

// Async thunks pour les appels API
export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async ({ skip = 0, limit = 100 }, { rejectWithValue }) => {
    try {
      const response = await hotelService.getHotels(skip, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchHotelById = createAsyncThunk(
  "hotels/fetchHotelById",
  async (hotelId, { rejectWithValue }) => {
    try {
      const response = await hotelService.getHotelById(hotelId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createHotel = createAsyncThunk(
  "hotels/createHotel",
  async (hotelData, { rejectWithValue }) => {
    try {
      const response = await hotelService.createHotel(hotelData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateHotel = createAsyncThunk(
  "hotels/updateHotel",
  async ({ hotelId, hotelData }, { rejectWithValue }) => {
    try {
      const response = await hotelService.updateHotel(hotelId, hotelData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteHotel = createAsyncThunk(
  "hotels/deleteHotel",
  async (hotelId, { rejectWithValue }) => {
    try {
      await hotelService.deleteHotel(hotelId);
      return hotelId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const hotelSlice = createSlice({
  name: "hotels",
  initialState: {
    items: [],
    currentHotel: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    resetHotelState: (state) => {
      state.currentHotel = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchHotels
      .addCase(fetchHotels.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // fetchHotelById
      .addCase(fetchHotelById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentHotel = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // createHotel
      .addCase(createHotel.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // updateHotel
      .addCase(updateHotel.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (hotel) => hotel.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.currentHotel = action.payload;
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // deleteHotel
      .addCase(deleteHotel.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(
          (hotel) => hotel.id !== action.payload
        );
        if (state.currentHotel && state.currentHotel.id === action.payload) {
          state.currentHotel = null;
        }
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetHotelState } = hotelSlice.actions;
export default hotelSlice.reducer;
