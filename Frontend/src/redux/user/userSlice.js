import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./userService";
import { toast } from "react-toastify";

const storedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  // isLoggedIn: false,
  isLoggedIn: storedUser ? true : false,

  // user: {},
  user: storedUser,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};



// register user
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
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

// login user
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
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

// logout user
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingInfo");

     thunkAPI.dispatch({ type: "RESET_STATE" });
    // Call the logout API
    const response = await authService.logout();
    return response;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      // Call the updateProfile API through authService
      return await authService.updateProfile(profileData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const sendVerificationRequest = createAsyncThunk(
  "user/sendVerificationRequest",
  async (email, thunkAPI) => {
    try {
     return await authService.sendVerificationRequest(email);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "user/verifyEmail",
  async ({ userId, token }, thunkAPI) => {
    try {
      return await authService.verifyEmail(userId, token); // Call the service function
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to verify email."
      );
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    RESET_AUTH(state) {
      user: JSON.parse(localStorage.getItem("user")) || null,
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder


      // login user
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        localStorage.setItem(
          "user",
          action.payload ? JSON.stringify(action.payload) : null
        );
        toast.success("Login successful!");
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload
          ? action.payload.toString()
          : "Unknown Error";
        state.user = null;
        toast.error(state.message);
      })

      // register user
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        toast.success("Register successful!");
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload
          ? action.payload.toString()
          : "Unknown Error";
        state.user = null;
        toast.error(state.message);
      })

      // logout user
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = false;
        state.user = null;
        // Remove user from localStorage
        localStorage.removeItem("user");
        toast.success(action.payload);
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload
          ? action.payload.toString()
          : "Unknown Error";
        state.user = null;
        toast.error(state.message);
      })
     .addCase(updateProfile.fulfilled, (state, action) => {
        // Merge the updated profile data with the existing user state
        state.user = { ...state.user, ...action.payload.user };
        state.loading = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    // Send Verification Request
  .addCase(sendVerificationRequest.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(sendVerificationRequest.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      toast.success(action.payload.message || "Verification email sent successfully!");
    })
    .addCase(sendVerificationRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload || "Failed to send verification email.";
      toast.error(state.message);
    })

    // Handle verifyEmail action
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = { ...state.user, email_verified: true }; 
        toast.success(action.payload.message || "Email verified successfully!");
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to verify email.";
        toast.error(state.message);
      });
  },
});

export const { RESET_AUTH } = userSlice.actions;

export default userSlice.reducer;
