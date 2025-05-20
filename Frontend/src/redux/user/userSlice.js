import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./userService";
import { toast } from "react-toastify";
import {
  requestVerificationOTP,
  verifyEmailWithOTP, // No need to rename
  requestLoginOTP,
  verifyLoginOTP
} from "./emailVerificationActions";

const storedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  isLoggedIn: storedUser ? true : false,
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
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ currentPassword, newPassword }, thunkAPI) => {
    try {
      return await authService.changePassword(currentPassword,newPassword);
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
    // FIX 1: Corrected the syntax in RESET_AUTH reducer
    RESET_AUTH(state) {
      state.user = JSON.parse(localStorage.getItem("user")) || null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    setEmailVerified(state) {
      if (state.user) {
        state.user.email_verified = true;
        const updatedUser = state.user
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
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
        const updatedUser = { ...state.user, ...action.payload.user };
        state.user = updatedUser;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("Updated user from localStorage:", localStorage.getItem("user"));
        state.isLoading = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
       
        state.isLoading = false;

      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
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
      })

      // Email verification OTP request
      .addCase(requestVerificationOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestVerificationOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Verification code sent successfully!";
      })
      .addCase(requestVerificationOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to send verification code";
      })

      // Email verification with OTP
      .addCase(verifyEmailWithOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyEmailWithOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update user email verification status if user is logged in
        if (state.user) {
          state.user = { ...state.user, email_verified: true };
          // Update localStorage as well
          localStorage.setItem("user", JSON.stringify(state.user));
        }
        
        state.message = action.payload.message || "Email verified successfully!";
      })
      .addCase(verifyEmailWithOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to verify email";
      })

      // Login OTP request
      .addCase(requestLoginOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestLoginOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Login code sent successfully!";
      })
      .addCase(requestLoginOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to send login code";
      })

      // Login with OTP verification
      .addCase(verifyLoginOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyLoginOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        state.message = "Login successful!";
      })
      .addCase(verifyLoginOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to verify login code";
      })
  },
});

export const { RESET_AUTH,setEmailVerified  } = userSlice.actions;

export default userSlice.reducer;