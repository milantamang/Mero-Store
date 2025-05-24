// Import necessary React components and libraries
import React from "react";
import { Link, Outlet } from "react-router-dom"; // Link for navigation, Outlet for nested routes
import {
  BiHomeAlt,     // Home icon
  BiUser,        // User icon
  BiPackage,     // Package/Products icon
  BiShoppingBag, // Shopping bag/Orders icon
  BiLogOut,      // Logout icon
  BiFolder,      // Folder icon for Categories and Offers
} from "react-icons/bi"; // Bootstrap icons library
import { useDispatch } from "react-redux"; // Hook to dispatch Redux actions

import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation
import { logout } from './../../redux/user/userSlice'; // Redux action for user logout

// Main Dashboard Layout Component - Creates the admin panel structure
const DashboardLayout = () => {
  // Redux hook to dispatch actions (like logout)
  const dispatch = useDispatch();
  
  // React Router hook to navigate programmatically
  const navigate = useNavigate();

  // Function to handle admin logout
  const handleAdminLogout = () => {
    dispatch(logout()); // Dispatch logout action to clear user data from Redux store
    navigate("/login"); // Redirect user to login page after logout
  };

  // JSX - The user interface structure
  return (
    // Main container with full viewport height
    <div className="container-fluid p-0 vh-100">
      {/* Bootstrap row with no gutters and full height */}
      <div className="row g-0 h-100">
        
        {/* LEFT SIDE: Sidebar Navigation */}
        <div className="col-md-3 col-lg-2 d-flex flex-column sidebar">
          
          {/* Sidebar Header - Logo and title */}
          <div className="sidebar-header p-4 border-bottom">
            <h3 className="text-light mb-0 fw-bold">Mero Store</h3>
            <p className="small text-light mb-0">Admin Dashboard</p>
          </div>

          {/* Navigation Menu - Main content area of sidebar */}
          <div className="flex-grow-1 p-3 overflow-auto">
            <ul className="nav flex-column gap-2">
              
              {/* Dashboard Home Link */}
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiHomeAlt className="me-3 fs-3" /> {/* Home icon */}
                  <span>Dashboard</span>
                </Link>
              </li>

              {/* Products Management Link */}
              <li className="nav-item">
                <Link to="/dashboard/products" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiPackage className="me-3 fs-3" /> {/* Package icon */}
                  <span>Products</span>
                </Link>
              </li>

              {/* Categories Management Link */}
              <li className="nav-item">
                <Link to="/dashboard/category" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiFolder className="me-3 fs-3" /> {/* Folder icon */}
                  <span>Categories</span>
                </Link>
              </li>

              {/* Offers Management Link */}
              <li className="nav-item">
                <Link to="/dashboard/offer" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiFolder className="me-3 fs-3" /> {/* Folder icon */}
                  <span>Offers</span>
                </Link>
              </li>

              {/* Users Management Link */}
              <li className="nav-item">
                <Link to="/dashboard/users" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiUser className="me-3 fs-3" /> {/* User icon */}
                  <span>Users</span>
                </Link>
              </li>

              {/* Orders Management Link */}
              <li className="nav-item">
                <Link to="/dashboard/orders" className="nav-link d-flex align-items-center py-3 px-3 rounded">
                  <BiShoppingBag className="me-3 fs-3" /> {/* Shopping bag icon */}
                  <span>Orders</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Sidebar Footer - Logout button */}
          <div className="p-3 border-top">
            <button
              onClick={handleAdminLogout} // Call logout function when clicked
              className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center py-2"
            >
              <BiLogOut className="me-2 fs-3" /> {/* Logout icon */}
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Main Content Area */}
        <div className="col-md-9 col-lg-10 bg-light p-0 overflow-auto">
          <div className="p-4">
            {/* 
              Outlet Component: This is where the nested route components will be rendered
              For example:
              - When user visits /dashboard → Dashboard Home component renders here
              - When user visits /dashboard/products → Products component renders here  
              - When user visits /dashboard/users → Users component renders here
              - And so on...
            */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

// Export component for use in other files
export default DashboardLayout;