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
  const [lastToastMessage, setLastToastMessage] = useState(""); // **NEW: Track last toast to prevent duplicates**
  const [selectedColor, setSelectedColor] = useState("");
  const { id } = useParams(); // Get product ID from URL parameters

  // Get data from Redux store
  const { product, loading, error } = useSelector((state) => state.products); // Product data and loading state
  const { wishitems } = useSelector((state) => state.wishlist); // User's wishlist items
  const { isLoggedIn } = useSelector((state) => state.user); // User login status

  // **NEW: Size options array to match backend**
  const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

  // **NEW: Function to show toast only if different from last one**
  const showToast = (message, type = "error") => {
    if (message !== lastToastMessage) {
      if (type === "error") {
        toast.error(message);
      } else if (type === "warning") {
        toast.warning(message);
      } else if (type === "success") {
        toast.success(message);
      }
      setLastToastMessage(message);

      // Clear the last message after 3 seconds to allow same message again later
      setTimeout(() => {
        setLastToastMessage("");
      }, 3000);
    }
  };

  // **NEW: Function to get available stock for selected size**
  const getAvailableStock = () => {
    if (!product || !selectedSize || !product.stock) {
      return 0; // Return 0 if no product, size, or stock data
    }

    // Find the index of selected size in SIZE_OPTIONS array
    const sizeIndex = SIZE_OPTIONS.indexOf(selectedSize);
    if (sizeIndex === -1) {
      return 0; // Return 0 if size not found
    }

    // Return stock quantity for the selected size
    return product.stock[sizeIndex] || 0;
  };

  // **NEW: Function to check if selected size is in stock**
  const isInStock = () => {
    return getAvailableStock() > 0;
  };

  // Effect hook: Fetch product details when component loads or ID changes
  useEffect(() => {
    if (id) {
      dispatch(getProductById(id)); // Fetch product data by ID
    }
  }, [id, dispatch]); // **FIXED: Added dispatch to dependency array**

  // Effect hook: Load user's wishlist when logged in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(userWishlist()); // Fetch user's wishlist items
    }
  }, [dispatch, isLoggedIn]);

  // **NEW: Effect to reset quantity when size changes (gentle reset)**
  useEffect(() => {
    if (selectedSize) {
      const availableStock = getAvailableStock();
      // Only reset quantity if current quantity exceeds available stock
      if (quantity > availableStock && availableStock > 0) {
        setQuantity(availableStock);
      } else if (availableStock === 0) {
        setQuantity(1); // Reset to 1 if no stock
      }
      // Don't reset to 1 if current quantity is valid
    }
  }, [selectedSize]); // Only depend on selectedSize, not quantity to avoid loops

  // Function to check if current product is already in user's wishlist
  const isProductInWishlist = () => {
    return wishitems.some((item) => item.product_name === product.name);
  };

  // Function to add product to wishlist
  const addWishlist = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Check if user is logged in
    if (!isLoggedIn) {
      showToast("Please log in to add to wishlist");
      return;
    }

    // Check if product is already in wishlist to avoid duplicates
    if (isProductInWishlist()) {
      showToast("This product is already in your wishlist", "warning");
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

  // **MODIFIED: Function to handle size selection with stock notification**
  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setSelectedSize(newSize); // Update selected size state

    // Check stock for newly selected size and show toast if out of stock
    if (newSize) {
      const sizeIndex = SIZE_OPTIONS.indexOf(newSize);
      const sizeStock =
        product.stock && product.stock[sizeIndex]
          ? product.stock[sizeIndex]
          : 0;

      if (sizeStock === 0) {
        showToast(`Size ${newSize} is completely out of stock`, "warning");
      } else if (sizeStock === 1) {
        // Optional: You can comment this out if you don't want to show this message
        // showToast(`Only 1 item available for size ${newSize}`, "warning");
      }
    }
  };
  const handleColorSelection = (color) => {
    setSelectedColor(color.trim()); // Update selected color state, trim to remove spaces
    console.log("Selected color:", color.trim()); // Debug log to see selected color
  };
  // **MODIFIED: Function to handle quantity increase with stock validation**
  const increaseQuantity = () => {
    const availableStock = getAvailableStock();

    // Check if user is trying to exceed available stock
    if (quantity >= availableStock) {
      if (availableStock === 0) {
        showToast(`Size ${selectedSize} is completely out of stock`);
      } else if (availableStock === 1) {
        showToast(`Only 1 item available in stock for size ${selectedSize}`);
      } else {
        showToast(
          `Only ${availableStock} items available in stock for size ${selectedSize}`
        );
      }
      return; // Don't increase quantity - stop here
    }

    // Increase quantity if within stock limit (no toast needed)
    setQuantity(quantity + 1);
  };

  // **MODIFIED: Function to handle quantity decrease (no toast needed)**
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1); // Decrease only if quantity is greater than 1
    }
    // No toast needed for decrease - it's always valid
  };

  // **MODIFIED: Function to handle direct quantity input (improved validation)**
  const handleQuantityInput = (e) => {
    const inputValue = parseInt(e.target.value) || 1;
    const availableStock = getAvailableStock();

    // Handle minimum quantity (no toast for this)
    if (inputValue <= 0) {
      setQuantity(1);
      return;
    }

    // Handle maximum quantity (show specific toast when user exceeds limit)
    if (inputValue > availableStock && availableStock > 0) {
      setQuantity(availableStock); // Set to maximum available

      // Show specific message based on stock quantity
      if (availableStock === 1) {
        showToast(`Only 1 item available in stock for size ${selectedSize}`);
      } else {
        showToast(
          `Only ${availableStock} items available in stock for size ${selectedSize}`
        );
      }
      return;
    }

    // Handle out of stock case
    if (availableStock === 0) {
      setQuantity(1); // Reset to 1
      showToast(`Size ${selectedSize} is completely out of stock`);
      return;
    }

    // Set valid quantity (no toast needed)
    setQuantity(inputValue);
  };

  // **MODIFIED: Function to add product to shopping cart with improved validation**
  // Function to add product to shopping cart
  const handleCart = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validation: Check if size is selected
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart");
      return;
    }

    // ADD THIS NEW VALIDATION: Check if color is selected
    if (!selectedColor) {
      toast.error("Please select a color before adding to cart");
      return;
    }

    // Check if user is logged in
    if (isLoggedIn) {
      // Create cart item object with all necessary data
      const newCartItem = {
        ...product, // Spread all product properties
        pid: product._id, // Product ID
        size: selectedSize, // Selected size
        quantity: quantity, // Selected quantity
        selectedColor: selectedColor, // ADD THIS LINE: Include selected color
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

                {/* **NEW: Stock status display** */}
                <p className="text-lg mb-2">
                  Availability:{" "}
                  {selectedSize ? (
                    isInStock() ? (
                      <span className="text-green-600 font-semibold">
                        In Stock ({getAvailableStock()} available)
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Out of Stock
                      </span>
                    )
                  ) : (
                    <span className="text-gray-500">
                      Select a size to check availability
                    </span>
                  )}
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
                  <div className="mb-4 flex gap-4 items-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Available Colors:
                    </h3>
                    <div className="flex gap-2 border border-red-600 p-1">
                      {/* Split colors by comma and create clickable color circles */}
                      {product.colors.split(",").map((color, index) => (
                        <div
                          key={index}
                          className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all hover:scale-110 ${
                            selectedColor === color.trim()
                              ? "border-blue-500 border-4" // Show blue border if this color is selected
                              : "border-gray-300" // Show gray border if not selected
                          }`}
                          style={{ backgroundColor: color.trim() }} // Set background color dynamically
                          onClick={() => handleColorSelection(color)} // Make color clickable
                          title={`Select ${color.trim()} color`} // Show tooltip on hover
                        ></div>
                      ))}
                    </div>
                    {/* Show selected color text */}
                    {selectedColor && (
                      <p className="text-sm text-gray-600 ml-2">
                        Selected:{" "}
                        <span className="font-semibold">{selectedColor}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* **MODIFIED: Quantity selector with stock validation** */}
                <div className="mt-4">
                  <h3 className="text-lg text-gray-800 font-semibold mb-2">
                    Quantity:
                  </h3>
                  <div className="flex items-center border rounded-md overflow-hidden w-max">
                    {/* Decrease quantity button */}
                    <button
                      onClick={decreaseQuantity} // Use new decrease function
                      className="h-10 w-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition"
                      disabled={quantity <= 1} // Disable if quantity is 1 or less
                    >
                      -
                    </button>
                    {/* Quantity input field */}
                    <input
                      type="number"
                      min="1"
                      max={selectedSize ? getAvailableStock() : 1} // **NEW: Set max based on stock**
                      value={quantity}
                      onChange={handleQuantityInput} // Use new input handler
                      className="h-10 w-12 text-center border-l border-r focus:outline-none"
                      disabled={!selectedSize} // **NEW: Disable if no size selected**
                    />
                    {/* Increase quantity button */}
                    <button
                      onClick={increaseQuantity} // Use new increase function
                      className="h-10 w-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition"
                      disabled={
                        !selectedSize || quantity >= getAvailableStock()
                      } // **NEW: Disable based on stock**
                    >
                      +
                    </button>
                  </div>
                  {/* **NEW: Show stock info** */}
                  {selectedSize && (
                    <p className="text-sm text-gray-500 mt-1">
                      {isInStock()
                        ? `${getAvailableStock()} items available`
                        : "Out of stock for this size"}
                    </p>
                  )}
                </div>

                {/* Action buttons section */}
                <div className="mt-6 flex flex-wrap gap-4">
                  {/* Add to cart button */}
                  <button
                    onClick={handleCart} // Call handleCart function
                    className={`px-6 py-2 text-white rounded-lg uppercase text-sm flex items-center gap-2 transition ${
                      selectedSize && isInStock()
                        ? "bg-primary hover:bg-primary-dark"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!selectedSize || !isInStock()} // **NEW: Disable if no size or out of stock**
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
