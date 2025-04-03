import React from "react";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/cart/cartSlice";
import { useDispatch } from "react-redux";

const ProductCard = ({ name, image, price, id }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product) => {
    dispatch(
      addToCart({
        name: product.name,
        image: product.image,
        price: product.price,
        id: product._id,
        ...product,
        product_id: product._id,
      })
    );
  };

  return (
    <>
      <div className="bg-white shadow rounded overflow-hidden group">
        <Link to={`/products/${id}`}>
          <div className="relative">
            <img src={image} alt="product 1" className="w-full" />
            <div
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center 
              justify-center gap-2 opacity-0 group-hover:opacity-100 transition"
            >
              <a
                href="#"
                className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                title="view product"
              >
                <i className="fa-solid fa-magnifying-glass" />
              </a>
              <a
                href="#"
                className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                title="add to wishlist"
              >
                <i className="fa-solid fa-heart" />
              </a>
            </div>
          </div>
          <div className="pt-4 pb-3 px-4">
            <a href="#">
              <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">
                {name}
              </h4>
            </a>
            <div className="flex items-baseline mb-1 space-x-2">
              <p className="text-xl text-primary font-semibold">${price}</p>
              <p className="text-sm text-gray-400 line-through">$55.90</p>
            </div>
            <div className="flex items-center">
              <div className="flex gap-1 text-sm text-yellow-400">
                <span>
                  <i className="fa-solid fa-star" />
                </span>
                <span>
                  <i className="fa-solid fa-star" />
                </span>
                <span>
                  <i className="fa-solid fa-star" />
                </span>
                <span>
                  <i className="fa-solid fa-star" />
                </span>
                <span>
                  <i className="fa-solid fa-star" />
                </span>
              </div>
              <div className="text-xs text-gray-500 ml-3">(150)</div>
            </div>
          </div>
        </Link>

        <button
          onClick={() => addToCartHandler({ name, image, price, id })}
          className="block w-full py-1 text-center text-white bg-primary border border-primary rounded-b hover:bg-sec hover:text-white transition"
        >
          Add to cart
        </button>
      </div>
    </>
  );
};

export default ProductCard;
