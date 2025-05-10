// This file shows the changes you need to make to the existing userSlice.js file

// Import the email verification actions
import { 
  requestVerificationOTP, 
  verifyEmailWithOTP,
  requestLoginOTP,
  verifyLoginOTP
} from "./emailVerificationActions";

// Add these extra reducers to your existing userSlice.js file

// Inside your extraReducers builder function, add:

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
});