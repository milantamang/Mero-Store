// Import necessary React hooks and libraries
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"; // Redux hooks for state management
import { useNavigate } from "react-router-dom"; // Hook for navigation between pages
import { toast } from "react-toastify"; // Library for showing notifications
import axios from "axios"; // Library for making API calls
import OtpVerification from "../components/OtpVerification"; // Custom component for OTP input
import { setEmailVerified  } from "../redux/user/userSlice"; // Redux action to mark email as verified

/**
 * OTP Email Verification Page
 * Allows users to verify their email using OTP
 */
const OtpEmailVerification = () => {
  // Get user data from Redux store
  const { user, isLoggedIn } = useSelector((state) => state.user);
  
  // Local state variables to manage component data
  const [userId, setUserId] = useState(null); // Store user ID
  const [email, setEmail] = useState(""); // Store email address
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [otpRequested, setOtpRequested] = useState(false); // Track if OTP was requested
  
  // Hooks for navigation and Redux actions
  const navigate = useNavigate(); // Hook to navigate between pages
  const dispatch = useDispatch(); // Hook to dispatch Redux actions

  // Effect hook: Runs when component loads or when isLoggedIn/user changes
  useEffect(() => {
    if (isLoggedIn && user) {
      setEmail(user.email); // Pre-fill email if user is logged in
      setUserId(user._id); // Set user ID from logged in user
    }
  }, [isLoggedIn, user]);

  // Function to request OTP from server
  const handleRequestOTP = async (e) => {
    e?.preventDefault(); // Prevent form default submission
    
    // Validation: Check if email is entered
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true); // Show loading state
    
    try {
      // Make API call to request OTP
      const response = await axios.post(
        "http://localhost:5000/api/v1/request-verification-otp",
        { email }
      );
      
      // If successful, update state
      setUserId(response.data.userId);
      setOtpRequested(true); // Show OTP input form
      toast.success("Verification code sent to your email");
    } catch (error) {
      // Handle errors
      console.error("Error requesting verification OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send verification code");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };
  
  // Function called when OTP verification is successful
  const handleVerificationSuccess = (data) => {
    toast.success("Email verified successfully!");
    dispatch(setEmailVerified()); // Update Redux state to mark email as verified
    if (data) {
      navigate('/') // Navigate to home page
    }
  };

  // JSX: The component's user interface
  return (
    // Main container with full screen height and centered content
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Card container */}
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        {/* Header section */}
        <div>
          {/* Dynamic title based on OTP request status */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {otpRequested ? "Verify Your Email" : "Email Verification"}
          </h2>
          {/* Dynamic subtitle based on OTP request status */}
          <p className="mt-2 text-center text-sm text-gray-600">
            {otpRequested 
              ? "Enter the verification code sent to your email" 
              : "Verify your email address to activate your account"}
          </p>
        </div>

        {/* Conditional rendering: Show email form OR OTP verification */}
        {!otpRequested ? (
          // Email input form (shown initially)
          <form className="mt-8 space-y-6" onSubmit={handleRequestOTP}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                {/* Screen reader label */}
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                {/* Email input field */}
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-md"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                  disabled={!!user} // Disable input if user is already logged in
                />
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isLoading} // Disable button during loading
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLoading ? "bg-gray-400" : "bg-primary hover:bg-sec" // Dynamic styling based on loading state
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
              >
                {/* Dynamic button text based on loading state */}
                {isLoading ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          </form>
        ) : (
          // OTP verification component (shown after OTP is requested)
          <div className="mt-8">
            <OtpVerification 
              userEmail={email} 
              purpose="verification" 
              onSuccess={handleVerificationSuccess} // Callback function for successful verification
            />
          </div>
        )}

        {/* Footer section with navigation options */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {/* Conditional buttons based on OTP request status */}
            {otpRequested ? (
              // Button to go back to email input
              <button 
                onClick={() => setOtpRequested(false)} 
                className="text-primary hover:text-sec"
              >
                Use a different email
              </button>
            ) : (
              // Button to go back to previous page
              <button 
                onClick={() => navigate(-1)} 
                className="text-primary hover:text-sec"
              >
                Return to previous page
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

// Export component for use in other files
export default OtpEmailVerification;