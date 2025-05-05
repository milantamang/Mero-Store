import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { createNewOrder } from "../redux/order/orderSlice";
import { clearCart, deleteCart } from '../redux/cart/cartSlice';
const PaymentSuccess = () => {
    const dispatch = useDispatch();
    const { cartItems, shippingInfo } = useSelector((state) => ({
    ...state.cart,
    }));
  const sub_total = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shipping_charge = 200;
  const tax = 100;

  const grand_total = sub_total + shipping_charge;

  const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          product: item._id,
          size: item.size,
        })),
        paymentInfo:"Paid with Khalti",
        shippingInfo: shippingInfo,
        itemsPrice: sub_total,
        taxPrice: 0,
        shippingPrice: shipping_charge,
        totalPrice: grand_total,
      };
      
      useEffect(() => {
    // Trigger order creation only once on page load
          try {
            dispatch(createNewOrder(orderData));
            dispatch(deleteCart());
            toast.success("Order placed successfully!");
          } catch (error) {
            console.error("Error creating order:", error);
            toast.error("Failed to create order.");
          }
        }, []);
  
  return (
    <>
        <div className="flex justify-center items-center h-[500px]">
      <h3 className='text-center text-3xl font-bold text-green-600'> Payment Successfully Done </h3>
    </div>
    </>
  )
}

export default PaymentSuccess
