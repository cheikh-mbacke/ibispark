import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { typeService } from "../services/typeService";

export const fetchTypes = createAsyncThunk(
  "types/fetchTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await typeService.getTypes();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const typeSlice = createSlice({
  name: "types",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default typeSlice.reducer;
