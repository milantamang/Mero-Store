import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import Products from "./pages/Products";
import PaymentSuccess from "./components/PaymentSuccess";
import Cancel from "./components/Cancel";
import Shipping from "./pages/Shipping";
import Thanks from "./pages/Thanks";
import ConfirmOrder from "./pages/ConfirmOrder";
import Men from "./pages/Men";
import Children from "./pages/Children";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Women from "./pages/women";
import OtpLogin from "./pages/OtpLogin";
import OtpEmailVerification from "./pages/OtpEmailVerification";
import VerifyEmail from "./components/verifyEmail";
import CustomerOrders from "./pages/CustomerOrders";
import ChatBot from "./components/Chatbot";

// Dashboard
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardHome from "./pages/Dashboard/Home";
import Product from "./pages/Dashboard/Product";
import User from "./pages/Dashboard/User";
import Orders from "./pages/Dashboard/Orders";
import AddProducts from "./pages/Dashboard/AddProducts";
import EditProduct from "./pages/Dashboard/EditProduct";
import Category from "./pages/Dashboard/Category";
import AddOffer from "./pages/Dashboard/Offer";

function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    const isOnVerificationPage = window.location.pathname === "/otpEmailVerification";
    if (isLoggedIn && user && !user.email_verified && !isOnVerificationPage) {
      navigate("/otpEmailVerification");
    }
  }, [isLoggedIn, user, navigate]);

  return (
    <Routes>
      <Route path="/verifyemail/:userId/:token" element={<VerifyEmail />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/men" element={<Men category="men" />} />
        <Route path="/products/women" element={<Women category="women" />} />
        <Route path="/products/kids" element={<Children category="kids" />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/order/confirm" element={<ConfirmOrder />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />
        <Route path="/orders" element={<CustomerOrders />} />
        <Route path="/otpLogin" element={<OtpLogin />} />
        <Route path="/otpEmailVerification" element={<OtpEmailVerification />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>

      {/* Dashboard Routes (admin only) */}
      {isLoggedIn && user?.user_role === "admin" && (
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/products" element={<Product />} />
          <Route path="/dashboard/addproducts" element={<AddProducts />} />
          <Route path="/dashboard/editproduct/:id" element={<EditProduct />} />
          <Route path="/dashboard/users" element={<User />} />
          <Route path="/dashboard/category" element={<Category />} />
          <Route path="/dashboard/offer" element={<AddOffer />} />
          <Route path="/dashboard/orders" element={<Orders />} />
        </Route>
      )}

      {/* Redirect dashboard access to login if not authenticated */}
      {!isLoggedIn && <Route path="/dashboard/*" element={<Login />} />}
    </Routes>
  );
}

export default App;
