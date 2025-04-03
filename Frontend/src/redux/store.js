import { configureStore } from '@reduxjs/toolkit'
import hamReducer from './features/hamSlice'
import userReducer from './user/userSlice'
import productReducer from "./product/productSlice";
import cartReducer from './cart/cartSlice'
import wishlistReducer from './wishlist/wishlistSlice'
import orderReducer from './order/orderSlice'


export const store = configureStore({
  reducer: {
    hamburger:hamReducer,
    user:userReducer,
    products:productReducer,
    cart:cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    devTools: true
  },
})