import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaCartArrowDown } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { getProducts } from "../redux/product/productSlice";
import { toast } from "react-toastify";
import { addToCart } from "../redux/cart/cartSlice";
import ReactPaginate from "react-paginate";
import { addToWishlist, userWishlist } from "../redux/wishlist/wishlistSlice";
import axios from "axios";

export default function Products() {
  // Fix Redux selectors to avoid unnecessary re-renders
  const { products, error } = useSelector(state => state.products);
  const { wishitems } = useSelector(state => state.wishlist);
  const { isLoggedIn, user } = useSelector(state => state.user);

  const [list, setList] = useState([]);
  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [priceRange, setPriceRange] = useState();
  const [price, setPrice] = useState();
  const [keywords, setKeywords] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Load wishlist data when component mounts
  useEffect(() => {
    if (isLoggedIn) {
      console.log("Loading wishlist data...");
      dispatch(userWishlist())
        .unwrap()
        .then((data) => {
          console.log("Wishlist loaded successfully:", data);
        })
        .catch((error) => {
          console.error("Error loading wishlist:", error);
        });
    }
  }, [isLoggedIn, dispatch]);

  let priceArr = products.map((item) => item.price);
  let maxPrice = Math.max(...priceArr);
  useEffect(() => {
    if (maxPrice) {
      setPrice(maxPrice);
    }
  }, [maxPrice]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    setList(products);
  }, [products]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (products) {
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(keywords.toLowerCase())
      );
      if (selectedCategory) {
        setList(
          filteredProducts.filter((item) => item.category === selectedCategory)
        );
      } else {
        setList(filteredProducts);
      }
    }
  }, [keywords, selectedCategory, products]);

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/v1/getcategory"
      );
      setCategories(response.data.categories);
    };
    getCategories();
  }, []);

  const filterCategory = (cat_name) => {
    setSelectedCategory(cat_name);
  };

  // Improved isProductInWishlist function
  const isProductInWishlist = (productName) => {
    // Add a safety check to handle undefined or empty wishitems
    if (!wishitems || wishitems.length === 0) {
      return false;
    }
    
    // Debug - see what we're comparing against
    console.log("Checking if product exists:", productName);
    console.log("Current wishlist items:", wishitems.map(item => item.product_name));
    
    // Check for the product name in the wishlist
    return wishitems.some((item) => item.product_name === productName);
  };

  // price filter
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

  
  // Updated addToCartHandler
  const addToCartHandler = (product) => {
    if (isLoggedIn) {
      // Get the first size from the product.size array
      const firstSize = product.size && product.size.length > 0 ? product.size[0] : null;
      
      if (!firstSize) {
        toast.error("No size available for this product");
        return;
      }

      const cartItem = {
        pid: product._id,
        name: product.name,
        price: product.price,
        quantity: 1, 
        category: product.category,
        image: product.image,
        size: firstSize,
      };

      // Dispatch the addToCartAsync action
      dispatch(addToCart(cartItem));
    } else {
      toast.error("Please log in to add to cart");
      navigate("/login");
    }
  };

  // Updated addWishlist function
  const addWishlist = (product) => {
    if (!isLoggedIn) {
      toast.error("Please log in to add to wishlist");
      navigate("/login");
      return;
    }

    // Check BEFORE dispatching if the product is already in wishlist
    if (isProductInWishlist(product.name)) {
      toast.info("This product is already in your wishlist");
      return; // Don't dispatch the action at all
    }

    dispatch(
      addToWishlist({
        product_name: product.name,
        product_price: product.price,
        product_category: product.category,
        product_image: product.image
      })
    );
  };

  const startIndex = currentPage * itemsPerPage;
  const selectedProducts = list.slice(startIndex, startIndex + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <>
      <div className="bg-gray-100 overflow-x-hidden overflow-hidden">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-blue-800 pb-6 pt-10">
            <h1 className="text-3xl font-bold tracking-tight text-red-600 uppercase">
              Products
            </h1>

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
              {/* Filters by Category and Price */}
              <div className="flex flex-col w-1/3">
                {/* Category Filter */}
                <div className="w-full">
                  <div className="category_box">
                    <h3 className="text-xl border-b-2 border-red-800 font-mono mb-3 font-bold">
                      Category
                    </h3>
                    <div className="py-2 text-lg font-medium">
                      <span
                        onClick={() => filterCategory()}
                        className="border pt-1 border-blue-900 px-1 pe-[72px]"
                      >
                        All
                      </span>
                      {categories &&
                        categories.map((cat) => (
                          <span
                            className="flex flex-col border my-2 py-2 border-blue-900 px-1 hover:bg-blue-900 hover:text-white cursor-pointer"
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat.name)}
                          >
                            {cat.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Price Filter */}
                <div className="w-full ">
                  <div className="price_box">
                    <h3 className="text-xl border-b-2 border-red-800  font-mono     font-bold  my-2">
                      {" "}
                      Price{" "}
                    </h3>

                    <input
                      type="range"
                      min={1}
                      value={priceRange}
                      max={maxPrice}
                      onChange={handlePrice}
                    />
                    <h2> Rs.{price} </h2>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="w-full lg:col-span-3">
                <div className="grid grid-cols-1 pb-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                  {selectedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white shadow-md rounded-lg overflow-hidden group w-full"
                      style={{ maxWidth: "370px" }}
                    >
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
                          </div>
                        </div>
                      </Link>

                      <div className="flex justify-end pt-4 bg-gray-100 items-center gap-4 px-4 pb-4">
                        <button
                          onClick={() => addToCartHandler(product)}
                          className="flex p-2 items-center justify-center w-8 h-8 text-white bg-red-700 rounded-full hover:bg-primary transition duration-300 focus:outline-none"
                        >
                          <FaCartArrowDown className="text-xl" />
                        </button>
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
                {/* Pagination */}
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