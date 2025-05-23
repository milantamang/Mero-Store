// Import necessary React hooks and libraries
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Library for showing notifications
import { useDispatch, useSelector } from "react-redux"; // Redux hooks for state management
import { useParams } from "react-router-dom"; // Hook to get URL parameters
import { getProductById } from "../redux/product/productSlice"; // Redux action to fetch single product
import { addToCart } from "../redux/cart/cartSlice"; // Redux action to add item to cart
import { addToWishlist, userWishlist } from "../redux/wishlist/wishlistSlice"; // Redux actions for wishlist
import Loader from "./../components/Loader"; // Loading component

const ProductDetails = () => {
  // Local state variables for component data
  const [selectedSize, setSelectedSize] = useState(""); // Store selected product size
  const dispatch = useDispatch(); // Hook to dispatch Redux actions
  const [quantity, setQuantity] = useState(1); // Store selected quantity (default 1)

  const { id } = useParams(); // Get product ID from URL parameters

  // Get data from Redux store
  const { product, loading, error } = useSelector((state) => state.products); // Product data and loading state
  const { wishitems } = useSelector((state) => state.wishlist); // User's wishlist items
  const { isLoggedIn } = useSelector((state) => state.user); // User login status

  // Effect hook: Fetch product details when component loads or ID changes
  useEffect(() => {
    if (id) {
      dispatch(getProductById(id)); // Fetch product data by ID
    }
  }, [id, getProductById]);

  // Effect hook: Load user's wishlist when logged in
  useEffect(() => {
      if (isLoggedIn) {
          dispatch(userWishlist()); // Fetch user's wishlist items
      }
    }, [dispatch, isLoggedIn]);

  // Function to check if current product is already in user's wishlist
  const isProductInWishlist = () => {
    return wishitems.some((item) => item.product_name === product.name);
  };

  // Function to add product to wishlist
  const addWishlist = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Check if user is logged in
    if (!isLoggedIn) {
      toast.error("Please log in to add to wishlist");
      navigate("/login");
      return;
    }

    // Check if product is already in wishlist to avoid duplicates
    if (isProductInWishlist()) {
      toast.info("This product is already in your wishlist");
      return; // Don't even attempt the API call
    }

    // Dispatch action to add product to wishlist
    dispatch(
      addToWishlist({
        product_name: product.name,
        product_price: product.price,
        product_category: product.category,
        product_image: product.image,
      })
    );
  };

  // Function to handle size selection from dropdown
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value); // Update selected size state
  };

  // Function to add product to shopping cart
  const handleCart = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validation: Check if size is selected
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart");
      return;
    }

    // Check if user is logged in
    if (isLoggedIn) {
      // Check if the product with the same size is already in the cart

      // Create cart item object with all necessary data
      const newCartItem = {
        ...product, // Spread all product properties
        pid: product._id, // Product ID
        size: selectedSize, // Selected size
        quantity: quantity, // Selected quantity
      };

      dispatch(addToCart(newCartItem)); // Dispatch action to add item to cart
    } else {
      toast.error("Please log in to add to cart");
      navigate("/login");
    }
  };

  // JSX: Component's user interface
  return (
    <>
      {/* Conditional rendering: Show loader while fetching data */}
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          {/* Main product details container */}
          <div className="container mx-auto py-24 px-4 lg:px-8 overflow-x-hidden">
            {/* Page title */}
            <h1 className="text-3xl font-bold text-red-600 pb-6 text-start">
              Product Details
            </h1>
            {/* Product layout: Image on left, details on right */}
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Product image section */}
              <div className="w-full lg:w-1/2 flex justify-center items-center">
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-contain"
                  />
                </div>
              </div>

              {/* Product information section */}
              <div className="w-full lg:w-1/2">
                {/* Product name */}
                <h2 className="text-4xl font-semibold uppercase mb-4 text-gray-800">
                  {product.name}
                </h2>
                {/* Availability status */}
                <p className="text-lg text-green-600 font-semibold mb-2">
                  Availability: <span className="text-gray-700">In Stock</span>
                </p>
                {/* Product category */}
                <p className="text-lg text-gray-800 mb-4">
                  Category:{" "}
                  <span className="text-gray-600">{product.category}</span>
                </p>
                {/* Product price */}
                <p className="text-2xl text-gray-800 font-bold mb-4">
                  Price:{" "}
                  <span className="text-primary">Rs. {product.price}</span>
                </p>

                {/* Size selection dropdown */}
                <p className="text-md text-gray-800 font-bold mb-4">
                  Available Size: &nbsp; &nbsp;
                  <select
                    className="border border-red-400 px-2 py-1 rounded-md font-medium text-sm "
                    defaultValue=""
                    value={selectedSize}
                    onChange={handleSizeChange} // Handle size selection
                  >
                    <option value="" disabled>
                      Select a size
                    </option>
                    {/* Map through available sizes and create options */}
                    {product.size?.map((size, index) => (
                      <option key={index} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </p>

                {/* Available colors section (if colors exist) */}
                {product.colors && (
                  <div className="mb-4  flex gap-4 items-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Available Colors:
                    </h3>
                    <div className="flex gap-2 border border-red-600 p-1">
                      {/* Split colors by comma and create color circles */}
                      {product.colors.split(",").map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: color.trim() }} // Set background color dynamically
                        ></div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity selector with + and - buttons */}
                <div className="mt-4">
                  <h3 className="text-lg text-gray-800 font-semibold mb-2">
                    Quantity:
                  </h3>
                  <div className="flex items-center border rounded-md overflow-hidden w-max">
                    {/* Decrease quantity button */}
                    <button
                      onClick={() =>
                        setQuantity(quantity > 1 ? quantity - 1 : quantity) // Prevent quantity going below 1
                      }
                      className="h-10 w-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    {/* Quantity input field */}
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)} // Allow direct quantity input
                      className="h-10 w-12 text-center border-l border-r focus:outline-none"
                    />
                    {/* Increase quantity button */}
                    <button
                      onClick={() => setQuantity(quantity + 1)} // Increase quantity by 1
                      className="h-10 w-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action buttons section */}
                <div className="mt-6 flex flex-wrap gap-4">
                  {/* Add to cart button */}
                  <button
                    onClick={handleCart} // Call handleCart function
                    className="px-6 py-2 bg-primary text-white rounded-lg uppercase text-sm flex items-center gap-2 hover:bg-primary-dark transition"
                  >
                    <i className="fa-solid fa-bag-shopping" />
                    Add to Cart
                  </button>
                  {/* Add to wishlist button */}
                  <button
                    onClick={addWishlist} // Call addWishlist function
                    className="px-6 py-2 border border-blue-700 text-blue-700 rounded-lg uppercase text-sm flex items-center gap-2 hover:text-white hover:bg-blue-700 transition"
                  >
                    <i className="fa-solid fa-heart" />
                    Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Export component for use in other files
export default ProductDetails;