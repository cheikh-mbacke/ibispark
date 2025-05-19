import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { statusService } from "../services/statusService";

export const fetchStatuses = createAsyncThunk(
  "statuses/fetchStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await statusService.getStatuses();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addStatusToSpot = createAsyncThunk(
  "statuses/addStatusToSpot",
  async ({ spotId, statusData }, { rejectWithValue }) => {
    try {
      const response = await statusService.addStatusToSpot(spotId, statusData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeStatusFromSpot = createAsyncThunk(
  "statuses/removeStatusFromSpot",
  async ({ spotId, statusId }, { rejectWithValue }) => {
    try {
      await statusService.removeStatusFromSpot(spotId, statusId);
      return { spotId, statusId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const statusSlice = createSlice({
  name: "statuses",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatuses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addStatusToSpot.fulfilled, (state) => {
        state.status = "succeeded";
        // La mise à jour du spot est gérée dans spotSlice
      })
      .addCase(removeStatusFromSpot.fulfilled, (state) => {
        state.status = "succeeded";
        // La mise à jour du spot est gérée dans spotSlice
      });
  },
});

export default statusSlice.reducer;
