import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { createNewOrder } from "../redux/order/orderSlice";
import { clearCart, deleteCart } from "../redux/cart/cartSlice";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : [];

  const { cartItems, shippingInfo } = useSelector((state) => ({
    ...state.cart,
  }));

  const sub_total = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shipping_charge = 200;
  const tax = 100;

  const grand_total = sub_total + shipping_charge + tax;

  let Address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.pincode}, ${shippingInfo.country}`;

  const CartitemStr = cartItems
    .map((item) => {
      return item.name;
    })
    .join(", ");

  //  handle cash on delivery
  const cashonDelivery = async () => {
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          product: item._id,
          size: item.size,
        })),
        shippingInfo: shippingInfo,
        itemsPrice: sub_total,
        taxPrice: 0,
        shippingPrice: shipping_charge,
        totalPrice: grand_total,
      };
      console.log(orderData);
      dispatch(createNewOrder(orderData));
      dispatch(deleteCart());
      toast.success("Order placed successfully");
      // Redirect user to a thank you page or some other appropriate page
      navigate("/thanks");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error placing order");
    }
  };

  // khalti payment method
  const handlePaymentWithKhalti = async () => {
    
    const payload = {
      return_url: "http://localhost:5173/success",
      website_url: "http://localhost:5173/",
      amount: grand_total * 100,
      purchase_order_id: CartitemStr,
      purchase_order_name: CartitemStr,
      customer_info: {
        name: "Milan Tamang",
        email: "tamangmilan254@gmail.com",
        phone: "9800000001",
        Address,
      },
    };
    
    const res = await axios.post(
      "http://localhost:5000/initiate-payment",
      payload
    );

    console.log(res.data.payment_url);

    if (res.data) {
      
      window.location.href = res.data.payment_url;
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 pt-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          {/* Left Section (Shipping Details) */}
          <div className="space-y-6">
            {/* Shipping Info */}
            <div className="border border-blue-500 shadow-lg rounded-xl bg-white p-6">
              <h2 className="text-xl font-semibold text-blue-700 text-center border-b-2 border-blue-700 pb-2">
                Shipping Info
              </h2>
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Email:</h3>
                  <p className="text-gray-700">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Phone:</h3>
                  <p className="text-gray-700">{shippingInfo.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Address:</h3>
                  <p className="text-gray-700">{Address}</p>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="border border-blue-500 shadow-lg rounded-xl bg-white p-6">
              <h2 className="text-xl font-semibold text-blue-700 text-center border-b-2 border-blue-700 pb-2">
                Your Cart Items
              </h2>
              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="px-4 py-2 border border-blue-500">
                        Image
                      </th>
                      <th className="px-4 py-2 border border-blue-500">
                        Product Name
                      </th>
                      <th className="px-4 py-2 border border-blue-500">Size</th>
                      <th className="px-4 py-2 border border-blue-500">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <img
                            src={item.image}
                            alt="Product"
                            className="w-16 h-16 rounded-lg shadow-md"
                          />
                        </td>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.size}</td>

                        <td className="px-4 py-2 text-blue-700 font-semibold">
                          {item.quantity} x Rs.{item.price} = Rs.{" "}
                          {item.quantity * item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Section (Order Summary) */}
          <div className=" shadow-xl rounded-xl bg-white p-6">
            <h2 className="text-xl font-semibold text-blue-700 text-center border-b-2 border-blue-700 pb-2">
              Order Summary
            </h2>
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <strong>Subtotal:</strong>
                <h3 className="text-gray-700">Rs. {sub_total}</h3>
              </div>
               <div className="flex justify-between items-center">
                <strong>Shipping:</strong>
                <h3 className="text-gray-700">Rs. {shipping_charge}</h3>
              </div>
              <div className="flex justify-between items-center">
                <strong>Tax:</strong>
                <h3 className="text-gray-700">Rs. {tax}</h3>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold text-blue-800">
                <strong>Grand Total:</strong>
                <h3>Rs. {grand_total}</h3>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="mt-6 flex flex-col gap-4">
              <button
                style={{ backgroundColor: "rgb(88, 86, 208)" }}
                className="w-full py-3 text-white font-semibold rounded-md shadow-md hover:brightness-110 transition duration-200"
                onClick={handlePaymentWithKhalti}
              >
                Pay with Khalti Wallet
              </button>

              <button
                style={{ backgroundColor: "rgb(145, 32, 32)" }}
                className="w-full py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition duration-200"
                onClick={cashonDelivery}
              >
                Cash on Delivery
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
