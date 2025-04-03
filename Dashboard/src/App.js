
import React from "react";
import "./App.css";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import {
  BiHomeAlt,
  BiUser,
  BiPackage,
  BiShoppingBag,
  BiLogOut,
  BiFolder,

} from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "./redux/user/userSlice";
import Home from "./pages/Home";
import Product from "./pages/Product";
import User from "./pages/User";
import Orders from "./pages/Orders";
import AddProducts from "./pages/AddProducts";
import Login from "./pages/Login";
import EditProduct from "./pages/EditProduct";
import Category from "./pages/Category";
import AddOffer from "./pages/Offer";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleAdminLogout = () => {
    dispatch(adminLogout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div className="container-fluid p-0 vh-100">
      <div className="row g-0 h-100">
        {/* Sidebar Navigation */}
        <div className="col-md-3 col-lg-2 d-flex flex-column sidebar">
          <div className="sidebar-header p-4 border-bottom">
            <h3 className="text-light mb-0 fw-bold">Mero Store</h3>
            <p className="small text-light mb-0">Admin Dashboard</p>
          </div>
          
          <div className="flex-grow-1 p-3 overflow-auto">
            <ul className="nav flex-column gap-2">
              <li className="nav-item">
                <Link to="/" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiHomeAlt className="me-3 fs-3" />
                  <span>Dashboard</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/products" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiPackage className="me-3 fs-3" />
                  <span>Products</span>
                </Link>
                
              </li>

              <li className="nav-item">
                <Link to="/category" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiFolder className="me-3 fs-3" />
                  <span>Categories</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/offer" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiFolder className="me-3 fs-3" />
                  <span>Offers</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/users" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiUser className="me-3 fs-3" />
                  <span>Users</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/orders" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiShoppingBag className="me-3 fs-3" />
                  <span>Orders</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="p-3 border-top">
            <button 
              onClick={handleAdminLogout}
              className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center py-2"
            >
              <BiLogOut className="me-2 fs-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-md-9 col-lg-10 bg-light p-0 overflow-auto">
          <div className="p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Product />} />
              <Route path="/addproducts" element={<AddProducts />} />
              <Route path="/editproduct/:id" element={<EditProduct />} />
              <Route path="/users" element={<User />} />
              <Route path="/category" element={<Category />} />
              <Route path="/offer" element={<AddOffer />} />
              <Route path="/login" element={<Login />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;