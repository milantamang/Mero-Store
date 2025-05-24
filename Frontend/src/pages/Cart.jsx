import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  clearCart,
  decreaseQuantity,
  deleteCart,
  fetchCart,
  removeFromCart,
} from "../redux/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : [];

  const { cartItems, cartError } = useSelector((state) => ({
    ...state.cart,
  }));

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const increaseQty = (item) => {
    const updatedItem = {
      ...item,
      pid: item.product,
      quantity: 1,
    };
    dispatch(addToCart(updatedItem));
  };

  const decreaseQty = (id, quantity) => {
    if (quantity > 1) {
      dispatch(decreaseQuantity(id));
    } else {
      // If quantity is 1, remove the item from the cart
      removeItem(id);
    }
  };

  const removeItem = (id) => {
    if (cartItems.length === 1) {
      // If only one item is in the cart, delete the entire cart
      dispatch(deleteCart());
    } else {
      dispatch(removeFromCart(id));
    }
  };

  // creatting order
  const createOrder = () => {
    if (cartItems.length === 0) {
      toast.error(
        "Please add items to your cart before proceeding to checkout"
      );
    } else {
      navigate("/shipping");
    }
  };

  function totalPrice() {
    let x = 0;
    // eslint-disable-next-line
    cartItems.map((totalP) => {
      x += totalP.price * totalP.quantity;
    });
    return x;
  }

  return (
    <>
      <div className="grid lg:grid-cols-3 container mx-auto py-10">
        <div className="lg:col-span-2 pb-20 px-10 pt-10 bg-white overflow-x-auto">
          <div className="flex border-b pb-4">
            <h2 className="text-2xl font-extrabold text-sec flex-1">
              Shopping Cart
            </h2>
            <h3 className="text-xl font-extrabold text-[#333]">
              {" "}
              {cartItems.length == 0 && (
                <>
                  <div className="alert_box">
                    <h2 className="empty"> Cart is Empty Now </h2>
                  </div>
                </>
              )}
            </h3>
          </div>
          <div>
            <table className="mt-6 w-full border-collapse divide-y">
              <thead className="whitespace-nowrap text-left">
                <tr>
                  <th className="text-base text-primary p-4">Description</th>
                  <th className="text-base text-primary p-4">Size</th>
                  <th className="text-base text-primary p-4">Color</th>
                  <th className="text-base text-primary p-4">Quantity</th>
                  <th className="text-base text-primary p-4">Price</th>
                </tr>
              </thead>
              <tbody className="whitespace-nowrap divide-y">
                {cartItems.length > 0 && (
                  <>
                    {cartItems.map((item) => (
                      <React.Fragment key={item._id}>
                        <tr>
                          <td className="py-6 px-4">
                            <div className="flex items-center gap-6 w-max">
                              <div className="h-36 shrink-0">
                                <img
                                  src={item.image}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <p className="text-md font-bold text-[#333]">
                                  {item.name}
                                </p>

                                <button
                                  type="button"
                                  className="mt-4 font-semibold text-red-400 text-sm"
                                  onClick={() => removeItem(item.product)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-4">
                            <div>
                              <p className="text-md font-bold text-[#333]">
                                {item.size}
                              </p>
                            </div>
                          </td>
                          {/* COLOR COLUMN: */}
                          <td className="py-6 px-4">
                            <div className="flex items-center gap-2">
                              {/* Show color circle */}
                              {item.selectedColor && (
                                <div
                                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                                  style={{
                                    backgroundColor: item.selectedColor,
                                  }}
                                  title={item.selectedColor}
                                ></div>
                              )}
                              {/* Show color name */}
                              <p className="text-md font-bold text-[#333]">
                                {item.selectedColor || "No color selected"}
                              </p>
                            </div>
                          </td>
                          <td className="py-6 px-4">
                            <div className="flex divide-x border w-max">
                              <button
                                type="button"
                                className="bg-gray-100 px-4 py-2 font-semibold"
                                onClick={() =>
                                  decreaseQty(item.product, item.quantity)
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-3 fill-current"
                                  viewBox="0 0 124 124"
                                >
                                  <path
                                    d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                                    data-original="#000000"
                                  />
                                </svg>
                              </button>

                              <button
                                type="button"
                                className="bg-transparent px-4 py-2 font-semibold text-[#333] text-md"
                              >
                                <h3>{item.quantity}</h3>
                              </button>

                              <button
                                type="button"
                                className="bg-gray-800 text-white px-4 py-2 font-semibold"
                                onClick={() => increaseQty(item)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-3 fill-current"
                                  viewBox="0 0 42 42"
                                >
                                  <path
                                    d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                                    data-original="#000000"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td className="py-6 px-4">
                            <h4 className="text-md font-bold text-[#333]">
                              Rs. {item.price * item.quantity}
                            </h4>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => dispatch(deleteCart())}
            className="p-3 bg-red-600 text-white text-md rounded-sm "
          >
            Clear All cart
          </button>
        </div>

        {/* Order Summary - Show only when items are in the cart */}
        {cartItems.length > 0 && (
          <div className="bg-gray-50 p-10 shadow-lg">
            <h3 className="text-xl font-extrabold text-[#333] border-b pb-4">
              Order Summary
            </h3>
            <ul className="text-[#333] divide-y mt-6">
              <li className="flex flex-wrap gap-4 text-md py-4">
                Subtotal{" "}
                <span className="ml-auto font-bold">
                  Rs. {totalPrice().toLocaleString()}.00
                </span>
              </li>
              {/* <li className="flex flex-wrap gap-4 text-md py-4">
                Shipping <span className="ml-auto font-bold">Rs. 200</span>
              </li>
              <li className="flex flex-wrap gap-4 text-md py-4">
                Tax <span className="ml-auto font-bold">Rs. 100</span>
              </li> */}
              <li className="flex flex-wrap gap-4 text-md py-4 font-bold">
                Total{" "}
                <span className="ml-auto">
                  Rs. {totalPrice().toLocaleString()}.00
                </span>
              </li>
            </ul>

            <button
              type="button"
              onClick={createOrder}
              className="mt-6 text-md px-6 py-2.5 w-full bg-primary hover:bg-sec text-white rounded"
              target="_blank"
            >
              Check out
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
