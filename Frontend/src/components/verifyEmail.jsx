import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Function to verify the email
    const verifyUserEmail = async () => {
      try {
        setLoading(true);
        // Make API call to verify email
        const response = await axios.post(
          `http://localhost:5000/api/v1/verifyemail/${userId}/${token}`
        );
        
        setVerified(true);
        toast.success(response.data.message || "Email verified successfully!");
        
        // Redirect to login page after short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        console.error("Verification error:", error);
        toast.error(error.response?.data?.message || "Email verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyUserEmail();
  }, [userId, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">
          Email Verification
        </h1>
        
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        ) : verified ? (
          <div>
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
              <p className="font-bold">Email verified successfully!</p>
              <p className="text-sm mt-2">You will be redirected to login page.</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-sec transition"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              <p className="font-bold">Verification failed</p>
              <p className="text-sm mt-2">
                The verification link may be expired or invalid.
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-sec transition"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;