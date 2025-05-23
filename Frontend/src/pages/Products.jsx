// Import necessary React hooks and libraries
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // React Router for navigation and links
import { useDispatch, useSelector } from "react-redux"; // Redux hooks for state management
import { FaCartArrowDown } from "react-icons/fa"; // Cart icon from Font Awesome
import { FaHeart } from "react-icons/fa6"; // Heart icon for wishlist
import { getProducts } from "../redux/product/productSlice"; // Redux action to fetch products
import { toast } from "react-toastify"; // Library for showing notifications
import { addToCart } from "../redux/cart/cartSlice"; // Redux action to add item to cart
import ReactPaginate from "react-paginate"; // Library for pagination functionality
import { addToWishlist, userWishlist } from "../redux/wishlist/wishlistSlice"; // Redux actions for wishlist
import axios from "axios"; // Library for making API calls

export default function Products() {
  // Get data from Redux store (global state)
  const { products, error } = useSelector((state) => state.products); // Product data and error state
  const { wishitems } = useSelector((state) => state.wishlist); // User's wishlist items
  const { isLoggedIn, user } = useSelector((state) => state.user); // User authentication state

  // Local state variables for component functionality
  const [list, setList] = useState([]); // Filtered list of products to display
  const [categories, setCategories] = useState(); // Available product categories
  const [selectedCategory, setSelectedCategory] = useState(); // Currently selected category filter
  const [priceRange, setPriceRange] = useState(); // Selected price range for filtering
  const [price, setPrice] = useState(); // Current price limit for range slider
  const [keywords, setKeywords] = useState(""); // Search keywords entered by user
  const [currentPage, setCurrentPage] = useState(0); // Current page number for pagination
  const itemsPerPage = 6; // Number of products to show per page

  // Hooks for navigation and Redux actions
  const navigate = useNavigate(); // Hook for programmatic navigation
  const dispatch = useDispatch(); // Hook to dispatch Redux actions

  // Effect hook: Load user's wishlist data when component mounts or login status changes
  useEffect(() => {
    if (isLoggedIn) {
      console.log("Loading wishlist data...");
      dispatch(userWishlist()) // Fetch user's wishlist from server
        .unwrap()
        .then((data) => {
          console.log("Wishlist loaded successfully:", data);
        })
        .catch((error) => {
          console.error("Error loading wishlist:", error);
        });
    }
  }, [isLoggedIn, dispatch]);

  // Calculate maximum price from all products for price range slider
  let priceArr = products.map((item) => item.price); // Extract all product prices
  let maxPrice = Math.max(...priceArr); // Find the highest price
  
  // Effect hook: Set initial price range when maximum price is calculated
  useEffect(() => {
    if (maxPrice) {
      setPrice(maxPrice); // Set price slider to maximum value initially
    }
  }, [maxPrice]);

  // Effect hook: Fetch all products when component loads
  useEffect(() => {
    dispatch(getProducts()); // Dispatch action to get products from server
  }, [dispatch]);

  // Effect hook: Update displayed list when products data changes
  useEffect(() => {
    setList(products); // Set initial product list
  }, [products]);

  // Effect hook: Show error notifications if any errors occur
  useEffect(() => {
    if (error) {
      toast.error(error); // Display error message to user
    }
  }, [error]);

  // Effect hook: Filter products based on search keywords and selected category
  useEffect(() => {
    if (products) {
      // Filter products by search keywords (case-insensitive)
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(keywords.toLowerCase())
      );
      // Further filter by category if one is selected
      if (selectedCategory) {
        setList(
          filteredProducts.filter((item) => item.category === selectedCategory)
        );
      } else {
        setList(filteredProducts); // Show all filtered products if no category selected
      }
    }
  }, [keywords, selectedCategory, products]);

  // Effect hook: Fetch available categories from server when component loads
  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/v1/getcategory"
      );
      setCategories(response.data.categories); // Store categories in state
    };
    getCategories();
  }, []);

  // Function to handle category filter selection
  const filterCategory = (cat_name) => {
    setSelectedCategory(cat_name); // Update selected category
  };

  // Function to check if a product is already in user's wishlist
  const isProductInWishlist = (productName) => {
    // Safety check to handle undefined or empty wishlist
    if (!wishitems || !Array.isArray(wishitems) || wishitems.length === 0) {
      return false;
    }

    // Debug logs to track what we're comparing
    console.log("Checking if product exists:", productName);
    console.log(
      "Current wishlist items:",
      wishitems.map((item) => item.product_name)
    );

    // Check if product exists in wishlist (case-insensitive comparison)
    return wishitems.some(item => 
    item.product_name && item.product_name.toLowerCase() === productName.toLowerCase()
  );
  };

  // Function to handle price range filter
  const handlePrice = (e) => {
    setPrice(e.target.value); // Update displayed price
    setPriceRange(e.target.value); // Update price range for filtering

    let priceRangeValue = e.target.value;
    let priceFilter = products;

    // Filter products by selected price range
    if (priceRangeValue) {
      priceFilter = products.filter((item) => item.price <= priceRangeValue);
      setList(priceFilter); // Update displayed product list
    }
  };

  // Effect hook: Apply category filters to product list
  useEffect(() => {
    const applIFilters = () => {
      let productLists = products;

      // Filter by selected category
      if (selectedCategory) {
        productLists = productLists.filter(
          (item) => item.category === selectedCategory
        );
        setList(productLists);
      } else {
        setList(products); // Show all products if no category selected
      }
    };
    applIFilters();
  }, [products, selectedCategory]);

  // Function to add product to shopping cart
  const addToCartHandler = (product) => {
    if (isLoggedIn) {
      // Get the first available size from product (default selection)
      const firstSize =
        product.size && product.size.length > 0 ? product.size[0] : null;

      // Check if product has available sizes
      if (!firstSize) {
        toast.error("No size available for this product");
        return;
      }

      // Create cart item object with necessary data
      const cartItem = {
        pid: product._id, // Product ID
        name: product.name,
        price: product.price,
        quantity: 1, // Default quantity
        category: product.category,
        image: product.image,
        size: firstSize, // Use first available size
      };

      // Dispatch action to add item to cart
      dispatch(addToCart(cartItem));
    } else {
      toast.error("Please log in to add to cart");
      navigate("/login"); // Redirect to login page
    }
  };

  // Function to add product to wishlist
  const addWishlist = (product) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      toast.error("Please log in to add to wishlist");
      navigate("/login");
      return;
    }

    // Optional: Check if product is already in wishlist (commented out)
    // if (isProductInWishlist(product.name)) {
    //   toast.info("This product is already in your wishlist");
    //   return; // Don't dispatch the action at all
    // }

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

  // Calculate products to display on current page
  const startIndex = currentPage * itemsPerPage; // Starting index for current page
  const selectedProducts = list.slice(startIndex, startIndex + itemsPerPage); // Products for current page

  // Function to handle pagination page change
  const handlePageClick = (event) => {
    setCurrentPage(event.selected); // Update current page number
  };

  // JSX: Component's user interface
  return (
    <>
      {/* Main container with background and overflow handling */}
      <div className="bg-gray-100 overflow-x-hidden overflow-hidden">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header section with title and search bar */}
          <div className="flex items-baseline justify-between border-b border-blue-800 pb-6 pt-10">
            {/* Page title */}
            <h1 className="text-3xl font-bold tracking-tight text-red-600 uppercase">
              Products
            </h1>

            {/* Search form */}
            <form method="GET" className="flex max-w-3xl">
              <input
                type="text"
                name="search"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)} // Update search keywords
                className="w-[600px] py-2 text-center shadow border-primary"
                placeholder="Search products"
              />
              <button
                type="submit"
                className="bg-red-600 border border-primary text-white px-8 rounded-r-md hover:bg-transparent hover:text-primary transition"
              >
                Search
              </button>
            </form>
          </div>

          {/* Main content section */}
          <section aria-labelledby="products-heading" className="pb-24 pt-2">
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-4">
              {/* Sidebar with filters */}
              <div className="flex flex-col w-1/3">
                {/* Category filter section */}
                <div className="w-full">
                  <div className="category_box">
                    <h3 className="text-xl border-b-2 border-red-800 font-mono mb-3 font-bold">
                      Category
                    </h3>
                    <div className="py-2 text-lg font-medium">
                      {/* "All" category option */}
                      <span
                        onClick={() => filterCategory()} // Clear category filter
                        className="border pt-1 border-blue-900 px-1 pe-[72px]"
                      >
                        All
                      </span>
                      {/* Map through available categories */}
                      {categories &&
                        categories.map((cat) => (
                          <span
                            className="flex flex-col border my-2 py-2 border-blue-900 px-1 hover:bg-blue-900 hover:text-white cursor-pointer"
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat.name)} // Set selected category
                          >
                            {cat.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Price filter section */}
                <div className="w-full ">
                  <div className="price_box">
                    <h3 className="text-xl border-b-2 border-red-800  font-mono     font-bold  my-2">
                      {" "}
                      Price{" "}
                    </h3>

                    {/* Price range slider */}
                    <input
                      type="range"
                      min={1}
                      value={priceRange}
                      max={maxPrice}
                      onChange={handlePrice} // Handle price range change
                    />
                    {/* Display current price limit */}
                    <h2> Rs.{price} </h2>
                  </div>
                </div>
              </div>

              {/* Products grid section */}
              <div className="w-full lg:col-span-3">
                <div className="grid grid-cols-1 pb-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                  {/* Map through products for current page */}
                  {selectedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white shadow-md rounded-lg overflow-hidden group w-full"
                      style={{ maxWidth: "370px" }}
                    >
                      {/* Product image and details (clickable link) */}
                      <Link to={`/products/${product._id}`}>
                        {/* Product image with hover effect */}
                        <div className="w-full p-2 bg-white h-72 overflow-hidden flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        {/* Product information */}
                        <div className="pt-4 pb-3 px-4 bg-gray-100 border-b">
                          <h4 className="uppercase font-semibold text-lg mb-1 text-gray-700 hover:text-primary transition">
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between">
                            <p className="text-md text-primary font-semibold">
                              Rs. {product.price}
                            </p>
                          </div>
                        </div>
                      </Link>

                      {/* Action buttons (Add to Cart and Wishlist) */}
                      <div className="flex justify-end pt-4 bg-gray-100 items-center gap-4 px-4 pb-4">
                        {/* Add to cart button */}
                        <button
                          onClick={() => addToCartHandler(product)} // Add product to cart
                          className="flex p-2 items-center justify-center w-8 h-8 text-white bg-red-700 rounded-full hover:bg-primary transition duration-300 focus:outline-none"
                        >
                          <FaCartArrowDown className="text-xl" />
                        </button>
                        {/* Add to wishlist button with dynamic styling */}
                        <button
                          onClick={() => addWishlist(product)} // Add product to wishlist
                          className={`flex p-2 items-center justify-center w-8 h-8 text-white ${
                            isProductInWishlist(product.name)
                              ? "bg-red-500" // Different color if already in wishlist
                              : "bg-red-700" // Default color if not in wishlist
                          } rounded-full hover:bg-primary transition duration-300 focus:outline-none`}
                        >
                          <FaHeart className="text-xl" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination component */}
                <ReactPaginate
                  previousLabel={
                    <span className="prev py-1 px-3 rounded-md">Previous</span>
                  }
                  nextLabel={
                    <span className="next py-1 px-3 rounded-md">Next</span>
                  }
                  breakLabel={<span className="break">...</span>}
                  pageCount={Math.ceil(list.length / itemsPerPage)} // Calculate total pages
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick} // Handle page change
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                  previousClassName={"prev"}
                  nextClassName={"next"}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}