// Frontend/src/components/RegistrationOTP.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const RegistrationOTP = ({ userEmail,onSuccess,purpose }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();

  // Set up countdown timer for OTP resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Handle input change for each OTP digit
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    // Update the current input value
    const newOtp = [...otp];
    newOtp[index] = element.value.substring(element.value.length - 1);
    setOtp(newOtp);

    // Auto-focus to next input if current input has a value
    if (element.value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Handle backspace key
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    
    // Check if pasted data is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      
      // Focus on the last input
      const lastInput = document.getElementById("otp-5");
      if (lastInput) {
        lastInput.focus();
      }
    }
  };

  // Handle OTP verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP");
      setIsSubmitting(false);
      return;
    }

    try {
      
      if (purpose == "login") { 
      const response = await axios.post(
        "http://localhost:5000/api/v1/verify-login-otp",
        { userEmail, otp: otpValue }
      );
   
      toast.success("Email verified successfully!");
        onSuccess(response.data);
      }
      else if (purpose = "verification") {
        const response = await axios.post(
          "http://localhost:5000/api/v1/verify-email-otp",
          { userEmail, otp: otpValue }
        );
     
        toast.success("Email verified successfully!");
          onSuccess(response.data);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP resend
  const handleResend = async () => {
    if (timeLeft > 0) return;
    
    setTimeLeft(60); // Reset countdown

    try {
      await axios.post("http://localhost:5000/api/v1/request-verification-otp", { 
        email: userEmail,
        purpose:purpose
      });
      toast.success("OTP has been resent to your email");
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Verify Your Email</h2>
      <p className="text-gray-600 mb-6 text-center">
        We've sent a 6-digit code to {userEmail}. Please enter it below to complete your registration.
      </p>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex justify-center gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : null}
              maxLength="1"
              className="w-12 h-12 text-center text-xl font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-md font-medium text-white bg-primary hover:bg-sec"
        >
          {isSubmitting ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div className="mt-4">
        <p className="text-gray-600 text-center">
          Didn't receive the code?{" "}
          {timeLeft > 0 ? (
            <span className="text-gray-500">
              Resend in {timeLeft} seconds
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="text-primary font-medium hover:underline"
            >
              Resend Code
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default RegistrationOTP;