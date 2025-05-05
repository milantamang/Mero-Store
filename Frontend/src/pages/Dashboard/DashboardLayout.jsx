import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  BiHomeAlt,
  BiUser,
  BiPackage,
  BiShoppingBag,
  BiLogOut,
  BiFolder,
} from "react-icons/bi";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { logout } from './../../redux/user/userSlice';


const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

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
                <Link to="/dashboard" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiHomeAlt className="me-3 fs-3" />
                  <span>Dashboard</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/dashboard/products" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiPackage className="me-3 fs-3" />
                  <span>Products</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/dashboard/category" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiFolder className="me-3 fs-3" />
                  <span>Categories</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/dashboard/offer" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiFolder className="me-3 fs-3" />
                  <span>Offers</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/dashboard/users" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiUser className="me-3 fs-3" />
                  <span>Users</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/dashboard/orders" className="nav-link d-flex align-items-center py-3 px-3 rounded">
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
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;