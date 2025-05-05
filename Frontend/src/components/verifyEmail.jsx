import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { verifyEmail } from "../redux/user/userSlice"; // Redux action to verify email

const VerifyEmail = () => {
  const { userId, token } = useParams(); // Extract userId and token from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const handleVerifyEmail = async () => {
      try {
        await dispatch(verifyEmail({ userId, token })).unwrap(); // Dispatch Redux action
        navigate("/login"); // Redirect to login or another page
      } catch (error) {
        console.error("Error verifying email:", error);
        toast.error(error || "Failed to verify email. Try again.");

      } finally {
        setLoading(false); // Stop loading
      }
    };

    handleVerifyEmail();
  }, [userId, token, dispatch, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-gray-700">
          Verifying your email, please wait...
        </h1>
      </div>
    );
  }

  return null; // No UI needed after verification
};

export default VerifyEmail;