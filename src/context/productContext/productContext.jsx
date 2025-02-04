// ProductContext.js
import React, { createContext, useState } from "react";

// Create the context
export const ProductContext = createContext();

// Create a provider component
export const ProductProvider = ({ children }) => {
  // State to trigger product refresh
  const [refreshProducts, setRefreshProducts] = useState(false);

  return (
    <ProductContext.Provider value={{ refreshProducts, setRefreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
