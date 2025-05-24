// Import necessary React hooks and libraries
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // React Router for navigation
import { useDispatch, useSelector } from "react-redux"; // Redux for state management
import { FaCartArrowDown } from "react-icons/fa"; // Cart icon
import { FaHeart } from "react-icons/fa6"; // Heart icon for wishlist
import { getProducts } from "../redux/product/productSlice"; // Redux action to fetch products
import { toast } from "react-toastify"; // Notification library
import ReactPaginate from "react-paginate"; // Pagination component
import { addToWishlist } from "../redux/wishlist/wishlistSlice"; // Redux action for wishlist
import axios from "axios"; // For API calls

export default function Products() {
  // Get data from Redux store (global state)
  const { products, error } = useSelector((state) => ({ ...state.products }));
  const { wishitems } = useSelector((state) => ({ ...state.wishlist }));
  const { isLoggedIn, user } = useSelector((state) => state.user);

  // Local state variables for component functionality
  const [list, setList] = useState(products); // Filtered products to display
  const [categories, setCategories] = useState(); // Available categories from database
  const [selectedCategory, setSelectedCategory] = useState(); // Currently selected category
  const [priceRange, setPriceRange] = useState(); // Selected price range for filtering
  const [price, setPrice] = useState(); // Current price limit
  const [keywords, setKeywords] = useState(""); // Search keywords
  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const itemsPerPage = 6; // Number of products per page

  // Hooks for navigation and Redux actions
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Calculate maximum price from all products for price range slider
  let priceArr = products.map((item) => item.price);
  let maxPrice = Math.max(...priceArr);

  // Set initial price range when max price is calculated
  useEffect(() => {
    if (maxPrice) {
      setPrice(maxPrice);
    }
  }, [maxPrice]);

  // Fetch all products when component loads
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Update product list when products data changes
  useEffect(() => {
    setList(products);
  }, [products]);

  // Show error notifications if any errors occur
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Filter products based on search keywords and selected category
  useEffect(() => {
    if (products) {
      // Filter by search keywords (case-insensitive)
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(keywords.toLowerCase())
      );
      
      // Further filter by category if one is selected
      if (selectedCategory) {
        setList(
          filteredProducts.filter((item) => item.category === selectedCategory)
        );
      } else {
        setList(filteredProducts);
      }
    }
  }, [keywords, selectedCategory, products]);

  // Fetch available categories from server when component loads
  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/v1/getcategory"
      );
      setCategories(response.data.categories);
    };
    getCategories();
  }, []);

  // Function to handle category filter selection
  const filterCategory = (cat_name) => {
    setSelectedCategory(cat_name);
  };

  // Function to handle price range filter
  const handlePrice = (e) => {
    setPrice(e.target.value);
    setPriceRange(e.target.value);

    let priceRangeValue = e.target.value;
    let priceFilter = products;

    if (priceRangeValue) {
      priceFilter = products.filter((item) => item.price <= priceRangeValue);
      setList(priceFilter);
    }
  };

  // Apply category filters to product list
  useEffect(() => {
    const applIFilters = () => {
      let productLists = products;

      if (selectedCategory) {
        productLists = productLists.filter(
          (item) => item.category === selectedCategory
        );
        setList(productLists);
      } else {
        setList(products);
      }
    };
    applIFilters();
  }, [products, selectedCategory]);

  // MODIFIED: Function to redirect to product details page instead of adding to cart directly
  const handleAddToCartRedirect = (product) => {
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

  // Function to add product to wishlist
  const addWishlist = (product) => {
    if (isProductInWishlist(product._id)) {
      toast.error("Product already added to wishlist");
    } else {
      dispatch(
        addToWishlist({
          product_name: product.name,
          product_price: product.price,
          product_category: product.category,
          product_image: product.image,
        })
      );
    }
  };

  // Check if product is already in wishlist
  const isProductInWishlist = (productId) => {
    return wishitems.some((item) => item.product_id === productId);
  };

  // Pagination calculations
  const startIndex = currentPage * itemsPerPage;
  const selectedProducts = list.slice(startIndex, startIndex + itemsPerPage);

  // Handle pagination page change
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <>
      <div className="bg-gray-100 overflow-x-hidden overflow-hidden">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header section with title and search */}
          <div className="flex items-baseline justify-between border-b border-blue-800 pb-6 pt-10">
            <h1 className="text-3xl font-bold tracking-tight text-red-600 uppercase">
              Products
            </h1>

            {/* Search form */}
            <form method="GET" className="flex max-w-3xl">
              <input
                type="text"
                name="search"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
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

          <section aria-labelledby="products-heading" className="pb-24 pt-2">
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-4">
              {/* LEFT SIDEBAR: Filters by Category and Price */}
              <div className="flex flex-col w-1/3">
                
                {/* Category Filter Section */}
                <div className="w-full">
                  <div className="category_box">
                    <h3 className="text-xl border-b-2 border-red-800 font-mono mb-3 font-bold">
                      Category
                    </h3>
                    <div className="py-2 text-lg font-medium">
                      {/* FIXED: Removed flex styling to prevent "|" cursor issue */}
                      <div
                        onClick={() => filterCategory()}
                        className="block border my-2 py-2 border-blue-900 px-1 hover:bg-blue-900 hover:text-white cursor-pointer"
                        style={{ cursor: 'pointer' }}
                      >
                        All
                      </div>
                      {/* Map through categories from database */}
                      {categories &&
                        categories.map((cat) => (
                          <div
                            className="block border my-2 py-2 border-blue-900 px-1 hover:bg-blue-900 hover:text-white cursor-pointer"
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat.name)}
                            style={{ cursor: 'pointer' }}
                          >
                            {cat.name}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Price Filter Section */}
                <div className="w-full">
                  <div className="price_box">
                    <h3 className="text-xl border-b-2 border-red-800 font-mono font-bold my-2">
                      Price
                    </h3>
                    {/* Price range slider with pointer cursor */}
                    <input
                      type="range"
                      min={1}
                      value={priceRange}
                      max={maxPrice}
                      onChange={handlePrice}
                      style={{ cursor: 'pointer' }}
                      className="cursor-pointer"
                    />
                    <h2>Rs.{price}</h2>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Products Grid */}
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
                        <div className="w-full p-2 bg-white h-72 overflow-hidden flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        <div className="pt-4 pb-3 px-4 bg-gray-100 border-b">
                          <h4 className="uppercase font-semibold text-lg mb-1 text-gray-700 hover:text-primary transition">
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between">
                            <p className="text-md text-primary font-semibold">
                              Rs. {product.price}
                            </p>

                            {/* ADDED: Product Colors Display */}
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

                      {/* Action buttons: Add to Cart and Wishlist */}
                      <div className="flex justify-end pt-4 bg-gray-100 items-center gap-4 px-4 pb-4">
                        {/* MODIFIED: Add to Cart button now redirects to product details */}
                        <button
                          onClick={() => handleAddToCartRedirect(product)}
                          className="flex p-2 items-center justify-center w-8 h-8 text-white bg-red-700 rounded-full hover:bg-primary transition duration-300 focus:outline-none"
                          title="Select options and add to cart" // Added helpful tooltip
                        >
                          <FaCartArrowDown className="text-xl" />
                        </button>
                        {/* Add to Wishlist button - unchanged */}
                        <button
                          onClick={() => addWishlist(product)}
                          className="flex p-2 items-center justify-center w-8 h-8 text-white bg-red-700 rounded-full hover:bg-primary transition duration-300 focus:outline-none"
                        >
                          <FaHeart className="text-xl" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Component */}
                <ReactPaginate
                  previousLabel={
                    <span className="prev py-1 px-3 rounded-md">Previous</span>
                  }
                  nextLabel={
                    <span className="next py-1 px-3 rounded-md">Next</span>
                  }
                  breakLabel={<span className="break">...</span>}
                  pageCount={Math.ceil(list.length / itemsPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
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