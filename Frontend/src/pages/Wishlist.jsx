import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ADDED: Import useNavigate for redirection
import { MdDeleteForever } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa";
import { clearError, userWishlist } from "../redux/wishlist/wishlistSlice";
import { deleteWishlist } from "../redux/wishlist/wishlistSlice";
// import { useNavigate } from "react-router-dom"; // ADDED: For navigation
import { getProducts } from "../redux/product/productSlice"; // ADDED: To fetch products

const Wishlist = () => {
  const { wishitems, error } = useSelector((state) => ({ ...state.wishlist }));
  const { isLoggedIn } = useSelector((state) => state.user); // ADDED: Get login status
  const { products } = useSelector((state) => state.products); // ADDED: Get all products to find product ID
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ADDED: Initialize navigate hook

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
      navigate("/");
    }
    dispatch(userWishlist());
  }, [dispatch, toast, error]);

  // Function to delete item from wishlist
  const deleteWishlistHandler = (id) => {
    dispatch(deleteWishlist({ id }));
  };

  // ADDED: Function to redirect to product details page for cart functionality
  const handleAddToCartRedirect = (item) => {
    // Check if user is logged in first
    if (isLoggedIn) {
      // Find the product ID by matching the product name
      const matchingProduct = products.find(
        (product) => product.name === item.product_name
      );
      
      if (matchingProduct) {
        // If we found the matching product, redirect to its details page
        navigate(`/products/${matchingProduct._id}`);
      } else {
        // If product not found, redirect to products page with a helpful message
        navigate('/products');
        toast.info(`Search for "${item.product_name}" to add it to cart with your preferred options`);
      }
    } else {
      // If not logged in, ask user to log in first
      toast.error("Please log in to add items to cart");
      navigate("/login");
    }
  };

  return (
    <>
      <div className="bg-gray-100">
        <div className="container mx-auto py-10">
          <div className="pb-8  ">
            <h1 style={{ color: "rgb(147 57 57)" }} className="font-bold text-3xl text-[rgb(175, 53, 53)]]-600 border-b-4 border-red-600 inline-block pb-2">
              Your Favourite Wishlist
            </h1>
          </div>

          <div
            className="grid grid-cols-1         
 sm:grid-cols-2 md:grid-cols-4 gap-8"
          >
            {wishitems?.length === 0 ? (
              <div className="text-center bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700">
                  Wishlist is Empty
                </h2>
              </div>
            ) : (
              <>
                {wishitems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="relative">
                      <img
                        src={item.product_image}
                        alt="Product"
                        className="mx-auto mb-4 rounded-t-lg h-40 w-full object-cover hover:opacity-90 transition-opacity"
                      />
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
                        New
                      </span>
                    </div>
                    <div className="px-4">
                      <h2 className="text-xl font-bold text-gray-800  truncate">
                        {item.product_name}
                      </h2>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        Rs.{item.product_price}
                      </p>
                      <div className="flex justify-between items-center my-2 ">
                        {/* MODIFIED: Add to Cart button now has functionality and redirects */}
                        <button 
                          onClick={() => handleAddToCartRedirect(item)}
                          className="flex items-center justify-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow-md"
                          title="Select options and add to cart" // Added helpful tooltip
                        >
                          <FaCartArrowDown className="mr-2" />
                        </button>
                        
                        {/* Delete button - unchanged */}
                        <button
                          onClick={() => deleteWishlistHandler(item._id)}
                          className="flex items-center justify-center p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow-md"
                        >
                          <MdDeleteForever className="mr-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;