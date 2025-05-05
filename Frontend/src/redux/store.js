import { combineReducers, configureStore } from '@reduxjs/toolkit'
import hamReducer from './features/hamSlice'
import userReducer from './user/userSlice'
import productReducer from "./product/productSlice";
import cartReducer from './cart/cartSlice'
import wishlistReducer from './wishlist/wishlistSlice'
import orderReducer from './order/orderSlice'


// Combine all reducers
const appReducer = combineReducers({
  hamburger: hamReducer,
  user: userReducer,
  products: productReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  order: orderReducer,
});

// Root reducer to handle RESET_STATE
const rootReducer = (state, action) => {
  if (action.type === "RESET_STATE") {
    state = undefined; // Reset all states
  }
  return appReducer(state, action);
};

// Configure the store
export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});