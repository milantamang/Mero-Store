import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as service from "./orderService";

// create new order code
export const createNewOrder = createAsyncThunk(
  "orders/neworder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await service.createOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// get user orders
export const getUserOrders = createAsyncThunk(
  "orders/myorders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await service.userOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancelUserOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      return await service.cancelOrder(orderId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to cancel order";
      return rejectWithValue(message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: {},
    userOrders: [],
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
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
     .addCase(cancelUserOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelUserOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = state.userOrders.map((order) =>
          order._id === action.meta.arg ? { ...order, orderStatus: "Cancelled" } : order
        );
      })
      .addCase(cancelUserOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = orderSlice.actions;

export default orderSlice.reducer;
