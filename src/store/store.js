import { configureStore } from "@reduxjs/toolkit";
import products from "./slices/products";

export const store = configureStore({
  reducer: {
    products: products,
  },
});
