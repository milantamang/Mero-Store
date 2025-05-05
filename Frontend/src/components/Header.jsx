import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { close, toggle } from "../redux/features/hamSlice";

const Header = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => {
    return state.hamburger.value;
  });

  return (
    <>
      <nav style={{ backgroundColor: "rgb(46, 46, 46)" }}className="text-white  bg-red-600 py-4 body-font topheader overflow-x-hidden  sticky top-0 w-full  z-[99] shadow-xl  overflow-hidden ">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          {/* logo and hamburger menu */}
          <div className="flex items-center pt-2 md:hidden">
            <Link
              className="flex text-2xl ps-3 font-bold items-center uppercase text-white mb-4 md:mb-0"
              to="/"
            >
              Mero-Store
            </Link>
          </div>

          <div className="block lg:hidden">
            <button
              onClick={() => {
                dispatch(toggle());
              }}
              className="text-white focus:outline-none pe-3"
            >
              <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                ></path>
              </svg>
            </button>
          </div>

          {/* nav-items  mid  */}

          <div className="hidden lg:flex flex-grow justify-center font-medium space-x-20 ">
            <Link
              to="/"
              activeClassName="active"
              className=" hover:text-gray-300 "
            >
              <div className="flex justify-center items-center gap-1 ">
                Home
              </div>
            </Link>
            <Link
              to="/products "
              activeClassName="active"
              className=" hover:text-gray-300 "
            >
            Products
            </Link>
            <Link
              to="/products/men"
              activeClassName="active"
              className=" hover:text-gray-300 "
            >
              Men
            </Link>
            <Link
              to="/products/women"
              activeClassName="active"
              className=" hover:text-gray-300 "
            >
              Women
            </Link>
            <Link
              to="/products/kids"
              activeClassName="active"
              className=" hover:text-gray-300 "
            >
           Kids
            </Link>
          </div>
        </div>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } bg-gray-100   text-primary lg:hidden py-3 mt-5 text-center font-medium`}
        >
          {/* Mobile menu content */}
          <Link
            to="/"
            className="block text-red-600 px-4 py-2 border-b border-red-500"
            onClick={() => {
              dispatch(close());
            }}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="block text-red-600 px-4 py-2 border-b border-red-500"
            onClick={() => {
              dispatch(close());
            }}
          >
            Products
          </Link>
          <Link
              to="/products/men"
            className="block text-red-600 px-4 py-2 border-b border-red-500"
            onClick={() => {
              dispatch(close());
            }}
          >
            Men
          </Link>
          <Link
             to="/products/women"
            className="block text-red-600 px-4 py-2 border-b border-red-500"
            onClick={() => {
              dispatch(close());
            }}
          >
            Woman
          </Link>
          <Link
              to="/products/kids"
            className="block text-red-600 px-4 py-2  "
            onClick={() => {
              dispatch(close());
            }}
          >
            children
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;
