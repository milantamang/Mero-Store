import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as service from "./wishlistService";

export const addToWishlist = createAsyncThunk(
  "wishlist/createWishlist",
  async (wishData, { rejectWithValue }) => {
    try {
      const response = await service.createWishlist(wishData);
      toast.success("Product added to wishlist");
      return response.data;
    } catch (error) {
      // Check specifically for the "already in wishlist" error
      if (
        error.response?.data?.message === "Product already added to wishlist"
      ) {
        // Show an info toast instead of an error
        toast.info("This product is already in your wishlist");
        // Still need to return the rejection for proper state handling
        return rejectWithValue({
          message: error.response.data.message,
          alreadyExists: true,
        });
      }

      // For other errors, show error toast
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const userWishlist = createAsyncThunk(
  "wishlist/getUserWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await service.getUserWishlist();
      return response.data;
    } catch (error) {
      // If error is 404 "Wishlist not found", just return empty array
      if (error.response?.status === 404) {
        return [];
      }
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch wishlist" }
      );
    }
  }
);

export const deleteWishlist = createAsyncThunk(
  "wishlist/deleteWishlist",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await service.deleteWishlist(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishitems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishitems = [...state.wishitems, action.payload];
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;

        // Log the exact error details to help debug
        console.error("Wishlist error details:", action.payload);

        // Set the error message
        state.error = action.payload?.message || "Unknown error";

        // REMOVED DUPLICATE TOAST - it's already shown in the thunk
        // Only show error messages for non-wishlist duplicates
        if (action.payload?.message !== "Product already added to wishlist") {
          toast.error(state.error);
        }
      })

      // get users wishlist
      .addCase(userWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(userWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishitems = action.payload;
      })
      .addCase(userWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // delete users wishlist
      .addCase(deleteWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.wishitems = state.wishitems.filter((item) => item._id !== id);
        }
        toast.success("Items removed from wishlist");
      })
      .addCase(deleteWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearError } = wishlistSlice.actions;

export default wishlistSlice.reducer;