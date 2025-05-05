import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductById } from "../redux/product/productSlice";
import { addToCart } from "../redux/cart/cartSlice";
import { addToWishlist } from "../redux/wishlist/wishlistSlice";
import Loader from "./../components/Loader";

const ProductDetails = () => {
  const [selectedSize, setSelectedSize] = useState("");
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const { id } = useParams();

  const { product, loading } = useSelector((state) => ({ ...state.products }));
  const { wishitems, error } = useSelector((state) => ({ ...state.wishlist }));
  const { isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [id, getProductById]);

  // Check if the product is already in the wishlist
  const isProductInWishlist = () => {
    return wishitems.some((item) => item.product_name === product.name);
  };

  // add to wishlist
  const addWishlist = (e) => {
    e.preventDefault();

    if (isProductInWishlist()) {
      toast.error("Product already added wishlist");
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
  // Handle size selection
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

 

  // Updated handleCart function
  const handleCart = (e) => {
    e.preventDefault();

    if (!selectedSize) {
      toast.error("Please select a size before adding to cart");
      return;
    }

    if (isLoggedIn) {
    // Check if the product with the same size is already in the cart
    
      const newCartItem = { ...product,pid: product._id, size: selectedSize, quantity: quantity };
      
      dispatch(addToCart(newCartItem));
    
  } else {
    toast.error("Please log in to add to cart");
    navigate("/login");
  }
};

  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <div className="container mx-auto py-24 px-4 lg:px-8 overflow-x-hidden">
            <h1 className="text-3xl font-bold text-red-600 pb-6 text-start">
              Product Details
            </h1>
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Image Section */}
              <div className="w-full lg:w-1/2 flex justify-center items-center">
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-contain"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-4xl font-semibold uppercase mb-4 text-gray-800">
                  {product.name}
                </h2>
                <p className="text-lg text-green-600 font-semibold mb-2">
                  Availability: <span className="text-gray-700">In Stock</span>
                </p>
                <p className="text-lg text-gray-800 mb-4">
                  Category:{" "}
                  <span className="text-gray-600">{product.category}</span>
                </p>
                <p className="text-2xl text-gray-800 font-bold mb-4">
                  Price:{" "}
                  <span className="text-primary">Rs. {product.price}</span>
                </p>

                {/* Size Selection Dropdown */}
                <p className="text-md text-gray-800 font-bold mb-4">
                  Available Size: &nbsp; &nbsp;
                  <select
                    className="border border-red-400 px-2 py-1 rounded-md font-medium text-sm "
                    defaultValue=""
                    value={selectedSize}
                    onChange={handleSizeChange}
                  >
                    <option value="" disabled>
                      Select a size
                    </option>
                    {product.size?.map((size, index) => (
                      <option key={index} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </p>

                {/* Available Colors */}
                {product.colors && (
                  <div className="mb-4  flex gap-4 items-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Available Colors:
                    </h3>
                    <div className="flex gap-2 border border-red-600 p-1">
                      {product.colors.split(",").map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: color.trim() }}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mt-4">
                  <h3 className="text-lg text-gray-800 font-semibold mb-2">
                    Quantity:
                  </h3>
                  <div className="flex items-center border rounded-md overflow-hidden w-max">
                    <button
                      onClick={() =>
                        setQuantity(quantity > 1 ? quantity - 1 : quantity)
                      }
                      className="h-10 w-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="h-10 w-12 text-center border-l border-r focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    onClick={handleCart}
                    className="px-6 py-2 bg-primary text-white rounded-lg uppercase text-sm flex items-center gap-2 hover:bg-primary-dark transition"
                  >
                    <i className="fa-solid fa-bag-shopping" />
                    Add to Cart
                  </button>
                  <button
                    onClick={addWishlist}
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

export default ProductDetails;
