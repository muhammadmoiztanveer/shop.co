import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateClient as client } from "aws-amplify/api";
import { fetchTopRatedProducts } from "../../graphql/queries";

const initialState = {
  isLoading: false,
  topRatedProducts: [],
  allProducts: [],
  error: null,
};

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const lambdaResponse = await client.graphql({
        query: fetchTopRatedProducts,
      });
      const { topRatedProducts, allProducts } =
        lambdaResponse.data.fetchTopRatedProducts;
      return { topRatedProducts, allProducts };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Products slice
export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topRatedProducts = action.payload.topRatedProducts;
        state.allProducts = action.payload.allProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
