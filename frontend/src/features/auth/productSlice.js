import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:6543/products";

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Basic ${token}`,
  },
});

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
      const response = await axios.get(API_URL, getAuthHeader(token));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch products");
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
      const response = await axios.post(API_URL, product, getAuthHeader(token));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to add product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, product }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        product,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader(token));
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to delete product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.products[idx] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
