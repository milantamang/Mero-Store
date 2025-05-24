import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaCartArrowDown } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { getProducts } from "../redux/product/productSlice";
import { toast } from "react-toastify";

export default function Women({ category: propCategory }) {
  const { products, error } = useSelector((state) => ({ ...state.products }));
  const { category: routeCategory } = useParams();
  const { isLoggedIn } = useSelector((state) => state.user);
  const [list, setList] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState(
    propCategory || routeCategory || ""
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts()); // Fetch all products
  }, [dispatch]);

  useEffect(() => {
    // Determine the active category (from props, route, or default)
    setFilteredCategory(propCategory || routeCategory || "");
  }, [propCategory, routeCategory]);

  useEffect(() => {
    // Filter products based on the selected category
    if (filteredCategory && products) {
      const filteredProducts = products.filter(
        (product) =>
          product.category?.toLowerCase() === filteredCategory.toLowerCase()
      );
      setList(filteredProducts);
    } else {
      setList(products || []); // Default to all products if no category is specified
    }
  }, [filteredCategory, products]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // MODIFIED: Function to redirect to product details instead of adding to cart directly
  const addToCartHandler = (product) => {
    // Check if user is logged in first
    if (isLoggedIn) {
      // Redirect to product details page where user can select size, color, quantity
      navigate(`/products/${product._id}`);
    } else {
      // If not logged in, ask user to log in first
      toast.error("Please log in to add items to cart");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (products) {
      console.log("Products fetched:", products); // Debugging log
    }
    console.log("Filtered category:", filteredCategory); // Debugging log
  }, [products, filteredCategory]);

  return (
    <div className="bg-gray-50 overflow-x-hidden py-10">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl mb-4 font-bold tracking-tight text-red-600 pt-6  text-center border-b-2 inline-table  border-red-600 uppercase">
          {filteredCategory ? `${filteredCategory} products` : "Our Products"}
        </h1>
        <div className="grid grid-cols-1 pb-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {list.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-lg overflow-hidden group w-full"
              style={{ maxWidth: "370px" }} // Optional for consistent card size
            >
              <Link to={`/products/${product._id}`}>
                {/* Product Image */}
                <div className="w-full p-2 bg-white h-72 overflow-hidden flex items-center justify-center ">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {/* Product Details */}
                <div className="pt-4 pb-3 px-4 bg-gray-100 border-b">
                  <h4 className="uppercase font-semibold text-lg mb-1 text-gray-700 hover:text-primary transition">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <p className="text-md text-primary font-semibold">
                      Rs. {product.price}
                    </p>

                    {/* Product Colors */}
                    {product.colors && (
                      <div className="flex gap-2 mt-2">
                        {product.colors.split(",").map((color, index) => (
                          <span
                            key={index}
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: color.trim() }} // trim() removes extra spaces
                          ></span>
                        ))}
                        <p>{product.colors}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
              {/* Action Buttons */}
              <div className="flex justify-end pt-4 bg-gray-100 items-center gap-4 px-4 pb-4">
                {/* MODIFIED: Button now redirects to product details instead of adding to cart directly */}
                <button
                  onClick={() => addToCartHandler(product)}
                  className="flex p-2 items-center justify-center w-8 h-8 text-white bg-red-700 rounded-full hover:bg-primary transition duration-300 focus:outline-none"
                  title="Select options and add to cart" // Added helpful tooltip
                >
                  <FaCartArrowDown className="text-xl" />
                </button>
                <button className="flex p-2 items-center justify-center w-8 h-8 text-white bg-red-700 rounded-full hover:bg-primary transition duration-300 focus:outline-none">
                  <FaHeart className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}