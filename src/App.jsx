import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./pages/layout/layout";
import HomePage from "./pages/home/home";
import ProductPage from "@/pages/product/product";
import ProductsPage from "@/pages/products/products";
import CartPage from "@/pages/cart/cart";
import ContactPage from "@/pages/contact/contact";
import ProfilePage from "@/pages/profile/profile";
import ErrorPage from "@/pages/error/error";
import SigninPage from "@/pages/signin/signin";
import SignupPage from "@/pages/signup/signup";
import SetupPage from "@/pages/setup/setup";
import RegistrationVerificationPage from "@/pages/verifyRegistrationOtp/verifyRegistrationOtp";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route
          path="/verify-registration-otp"
          element={<RegistrationVerificationPage />}
        />
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}

        <Route path="/" element={<Layout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
