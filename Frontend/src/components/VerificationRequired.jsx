import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendVerificationRequest } from "../redux/user/userSlice"; // Import your Redux action

const VerificationRequired = () => {
  const dispatch = useDispatch();
 const user = useSelector((state) => state.user.user);
  const handleSendVerification = () => {
    dispatch(sendVerificationRequest(user.email))
      .unwrap()
      .then(() => {
      })
      .catch((error) => {
        toast.error(error || "Failed to send verification email.");
      });
  };

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-md my-4 mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Verification Required</h1>
      <p className="text-sm mb-4">
        Please verify your account to access this page. Check your email for the verification link.
      </p>
      <button
        onClick={handleSendVerification}
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
      >
        Resend Verification Email
      </button>
    </div>
  );
};

export default VerificationRequired;