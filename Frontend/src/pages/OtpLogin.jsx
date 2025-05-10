import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import OtpVerification from "../components/OtpVerification";

/**
 * OTP Login Page
 * Allows users to login with OTP sent to their email
 */
const OtpLogin = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const navigate = useNavigate();

  // Handle email submission to request OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/request-login-otp",
        { email }
      );
      
      // Store userId for OTP verification
      setUserId(response.data.userId);
      setShowOtpForm(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      console.error("Error requesting OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful OTP verification
  const handleOtpSuccess = (userData) => {
    // Store user data in localStorage
    if (userData.user_token) {
      localStorage.setItem("token", userData.user_token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Redirect to home page
      navigate("/");
      toast.success("Login successful!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {showOtpForm ? "Verify OTP" : "Login with OTP"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {showOtpForm 
              ? "Enter the verification code sent to your email" 
              : "We'll send a one-time password to your email"}
          </p>
        </div>

        {!showOtpForm ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-md"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLoading ? "bg-gray-400" : "bg-primary hover:bg-sec"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8">
            <OtpVerification 
              userId={userId} 
              purpose="login" 
              onSuccess={handleOtpSuccess}
              resendEndpoint="http://localhost:5000/api/v1/request-login-otp"
            />
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {showOtpForm ? (
              <button 
                onClick={() => setShowOtpForm(false)} 
                className="text-primary hover:text-sec"
              >
                Use a different email
              </button>
            ) : (
              <>
                <Link to="/login" className="text-primary hover:text-sec">
                  Login with password
                </Link>
                <span className="mx-2">|</span>
                <Link to="/register" className="text-primary hover:text-sec">
                  Create an account
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpLogin;