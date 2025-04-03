import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const fetchFromLocalStorage = () => {
  let cart = localStorage.getItem("cartItems");
  if (cart) {
    return JSON.parse(cart);
  } else {
    return [];
  }
};

const storeInLocalStorage = (data) => {
  localStorage.setItem("cartItems", JSON.stringify(data));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: fetchFromLocalStorage(),
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
    quantity: 0,
    loading: false,
    cartError: null,
  },

  reducers: {
    addToCart: (state, action) => {
      const item = state.cartItems.find((p) => p._id === action.payload._id);
      if (item) {
        item.qty++;
        toast.success("Item quantity increased");
      } else {
        toast.success("Item added to cart");
        state.cartItems.push(action.payload);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      state.quantity += 1;
      // state.total += action.payload.price * action.payload.qty;
    },
    increaseQuantity: (state, action) => {
      state.cartItems.map((item) => {
        if (item._id === action.payload) {
          item.qty += 1;
        }
      });
      storeInLocalStorage(state.cartItems);
    },
    decreaseQuantity: (state, action) => {
      state.cartItems.map((item) => {
        if (item._id === action.payload) {
          item.qty -= 1;
        }
        if (item.qty === 0) {
          state.cartItems = state.cartItems.filter(
            (item) => item._id !== action.payload
          );
        }
      });
      storeInLocalStorage(state.cartItems);
    },
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      storeInLocalStorage(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      storeInLocalStorage(state.cartItems);
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeCartItem,
  clearCart,
  saveShippingInfo,
} = cartSlice.actions;

export default cartSlice.reducer;
