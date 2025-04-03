




import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle,FaUser } from "react-icons/fa";
import { userWishlist } from "../redux/wishlist/wishlistSlice";
import { RESET_AUTH, logout } from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishitems = useSelector((state) => state.wishlist.wishitems);
  
  // Dropdown State
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Cart and Wishlist Counts
  const cartLength = cartItems.reduce((total, item) => total + item.qty, 0);
  const wish = wishitems.length;

  // Logout Function
  const logoutUser = async () => {
    await dispatch(logout());
    await dispatch(RESET_AUTH());
    navigate("/login");
  };

  // Fetch Wishlist Data
  useEffect(() => {
    dispatch(userWishlist());
  }, [dispatch]);

  // Close Dropdown on Outside Click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white text-red-600 py-3 flex justify-between items-center z-[99]">
      <div className="container mx-auto flex flex-col md:flex-row flex-wrap justify-end md:justify-between items-center px-4">
        {/* Left: Logo */}
        <div className="text-2xl font-bold uppercase text-red-600 hidden lg:block">
          mero-store
        </div>

        {/* Right: Icons */}
        <div className="flex items-center justify-between space-x-4 lg:space-x-10">
          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="text-center hover:text-red-800 transition relative"
          >
            <div className="text-2xl text-red-600">
              <i className="fa-regular fa-heart" />
            </div>
            <div className="absolute -right-3 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-white text-red-500 text-xs font-bold border border-red-600">
              {wish}
            </div>
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="text-center hover:text-red-800 transition relative"
          >
            <div className="text-2xl text-red-600">
              <i className="fa-solid fa-bag-shopping" />
            </div>
            <div className="absolute -right-3 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-white text-red-500 text-xs font-bold border border-red-600">
              {cartLength}
            </div>
          </Link>

          {/* Authentication Dropdown */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center hover:text-red-800 transition text-red-600 font-semibold"
              >
                <FaUser size={25} className="mr-1" />
                <span className="ml-1 hidden md:inline text-sm"> My Account</span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-red-500 z-[200]  border-gray-200 rounded-md shadow-lg">
                  <ul className="py-2 ">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 border-b py-2 text-white hover:bg-gray-100 hover:text-red-500"
                      >
                        Profile
                      </Link>
                    </li>
                  
                    <li>
                      <button
                        onClick={logoutUser}
                        className="block w-100 px-4  py-2 text-white hover:bg-gray-100 hover:text-red-500"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hover:text-red-800 text-red-600 transition"
            >
              <FaUserCircle size={25} className="mr-1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;

