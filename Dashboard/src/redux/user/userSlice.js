import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./userService";
import { toast } from "react-toastify";

// admin login
export const adminlogin = createAsyncThunk(
  "admin/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.adminlogin(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// admin logout
export const adminLogout = createAsyncThunk(
  "admin/logout",
  async (_, thunkAPI) => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.toString());
    }
  }
);

const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

const initialState = {
  isLoggedIn: !!storedToken,  
  user: storedUser || {},
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    RESET_AUTH(state) {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    userLogout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // admin login
      .addCase(adminlogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminlogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));

        localStorage.setItem("token", action.payload.admin_token);
        toast.success(" admin login successful!");
      })
      .addCase(adminlogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload
          ? action.payload.toString()
          : "Unknown Error";
        state.user = null;
        toast.error(state.message);
      })


      
      // admin logout
      .addCase(adminLogout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = {};
         // Remove user & token from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
        toast.success("Admin logout successful!");
      })
      .addCase(adminLogout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload
          ? action.payload.toString()
          : "Unknown Error";
        toast.error(state.message);
      });
  },
});

export const { RESET_AUTH, userLogout } = userSlice.actions;

export default userSlice.reducer;
