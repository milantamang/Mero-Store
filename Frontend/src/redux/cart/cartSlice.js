import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartService from "./cartService";
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
// Async thunk to add an item to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartItem, { rejectWithValue }) => {
    try {
      return await cartService.addToCart(cartItem); // Call backend API
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to add item to cart";
      return rejectWithValue(message);
    }
  }
);

// Async thunk to fetch the user's cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getUserCart(); 
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to fetch cart";
      return rejectWithValue(message);
    }
  }
);

// Async thunk to remove an item from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId, {  rejectWithValue }) => {
    try {
      
      return await cartService.deleteCartItem(cartItemId); // Call backend API
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to remove item from cart";
      return rejectWithValue(message);
    }
  }
);

export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async ( _,{  rejectWithValue }) => {
    try {
      console.log("Deleting cart...")
      return await cartService.deleteCart(); 
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to delete the cart";
      return rejectWithValue(message);
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async ( cartItemId,{  rejectWithValue }) => {
    try {
      return await cartService.decreaseQuantity(cartItemId); 
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to decrease the cart item quantity";
      return rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: fetchFromLocalStorage(), 
     shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
    loading: false, 
    error: null, 
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
      toast.success("Cart cleared successfully!");
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
    },

  },
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload; 
        toast.success("Item added to cart successfully!");
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to add item to cart");
      })
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload; 
        storeInLocalStorage(state.cartItems);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.cartItems = [];
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = state.cartItems.filter(
          (item) => item.product !== action.meta.arg // Remove the item from the state
        );
        storeInLocalStorage(state.cartItems);
        toast.success("Item removed from cart successfully!");
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to remove item from cart");
      })
    
    // Delete the cart
      .addCase(deleteCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = []; // Clear the cart items from the state
        localStorage.removeItem("cartItems"); // Clear the cart from local storage
        toast.success("Deleted cart successfully!");
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to delete the cart");
      })
    .addCase(decreaseQuantity.pending, (state) => {
    state.loading = true;
  })
  .addCase(decreaseQuantity.fulfilled, (state, action) => {
    state.loading = false;
    state.cartItems = action.payload;
    storeInLocalStorage(state.cartItems);
    toast.success("Item quantity decreased successfully!");
  })
  .addCase(decreaseQuantity.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
    toast.error(action.payload || "Failed to decrease item quantity");
      });
  },
});

export const { clearCart,saveShippingInfo } = cartSlice.actions;
export default cartSlice.reducer;