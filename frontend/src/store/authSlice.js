import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Ici vous pourriez ajouter des fonctions d'authentification si nécessaire
// pour l'instant on le laisse simple

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    // Ici vous pourriez ajouter les cas pour les thunks d'authentification
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
