import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/v1/forgotpassword", { email });
      console.log('response msg', response)
      setMessage("Password reset link sent to your email!");
      setError("");
    } catch (err) {
      setMessage("");
      setError("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h3 className="text-center text-2xl font-semibold mb-4">Forgot Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg focus:outline-none"
        >
          Send Reset Link
        </button>
      </form>
  
      {/* Success or Error Messages */}
      {message && (
        <p className="text-center text-green-500 font-medium mt-3">{message}</p>
      )}
      {error && (
        <p className="text-center text-red-500 font-medium mt-3">{error}</p>
      )}
  
      {/* Navigation Link */}
      <div className="text-center mt-4">
        <p className="text-sm">
          Remember your password?{" "}
          <a
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Back to Login
          </a>
        </p>
      </div>
    </div>
  </div>
  
  );
};

export default ForgetPassword;