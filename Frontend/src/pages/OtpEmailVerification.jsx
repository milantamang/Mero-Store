import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import OtpVerification from "../components/OtpVerification";
import { setEmailVerified  } from "../redux/user/userSlice";

/**
 * OTP Email Verification Page
 * Allows users to verify their email using OTP
 */
const OtpEmailVerification = () => {
  const { user, isLoggedIn } = useSelector((state) => state.user);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // If user is already logged in, use their info
  useEffect(() => {
    if (isLoggedIn && user) {
      setEmail(user.email);
      setUserId(user._id);
    }
  }, [isLoggedIn, user]);

  // Handle OTP request
  const handleRequestOTP = async (e) => {
    e?.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/request-verification-otp",
        { email }
      );
      
      setUserId(response.data.userId);
      setOtpRequested(true);
      toast.success("Verification code sent to your email");
    } catch (error) {
      console.error("Error requesting verification OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle successful OTP verification
  const handleVerificationSuccess = (data) => {
    toast.success("Email verified successfully!");
    dispatch(setEmailVerified());
    if (data) {
      navigate('/')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {otpRequested ? "Verify Your Email" : "Email Verification"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {otpRequested 
              ? "Enter the verification code sent to your email" 
              : "Verify your email address to activate your account"}
          </p>
        </div>

        {!otpRequested ? (
          <form className="mt-8 space-y-6" onSubmit={handleRequestOTP}>
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
                  disabled={!!user} // Disable if user is already logged in
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
                {isLoading ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8">
            <OtpVerification 
              userEmail={email} 
              purpose="verification" 
              onSuccess={handleVerificationSuccess}
            />
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {otpRequested ? (
              <button 
                onClick={() => setOtpRequested(false)} 
                className="text-primary hover:text-sec"
              >
                Use a different email
              </button>
            ) : (
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

export default OtpEmailVerification;