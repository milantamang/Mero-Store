import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL
const API_BASE_URL = "http://localhost:5000/api/v1";

/**
 * Request email verification OTP
 */
export const requestVerificationOTP = createAsyncThunk(
  "user/requestVerificationOTP",
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/request-verification-otp`,
        { email }
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to request verification OTP";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Verify email with OTP
 */
export const verifyEmailWithOTP = createAsyncThunk(
  "user/verifyEmailWithOTP",
  async ({ userId, otp }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/verify-email-otp`,
        { userId, otp }
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to verify email";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Request login OTP
 */
export const requestLoginOTP = createAsyncThunk(
  "user/requestLoginOTP",
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/request-login-otp`,
        { email }
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to request login OTP";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Verify login OTP
 */
export const verifyLoginOTP = createAsyncThunk(
  "user/verifyLoginOTP",
  async ({ userId, otp }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/verify-login-otp`,
        { userId, otp }
      );
      
      // Store user data in localStorage
      localStorage.setItem("token", response.data.user_token);
      localStorage.setItem("user", JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to verify login OTP";
      return thunkAPI.rejectWithValue(message);
    }
  }
);