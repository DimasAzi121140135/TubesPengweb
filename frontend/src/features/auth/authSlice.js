import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:6543"; // Adjust backend URL if needed

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        auth: { username, password },
      });
      // If success, save username and password as basic auth token (simplified)
      const token = btoa(`${username}:${password}`);
      return token;
    } catch (error) {
      return thunkAPI.rejectWithValue("Invalid credentials");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
