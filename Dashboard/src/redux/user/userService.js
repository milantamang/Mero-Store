import axios from "axios";

const BACKEND_URL_ADMINLOGIN = "http://localhost:5000/api/v1/adminlogin";

// Admin Login user
const adminlogin = async (userData) => {
  const response = await axios.post(BACKEND_URL_ADMINLOGIN, userData);
  // Assuming the token is returned in the response from the backend
  const { admin_token } = response.data;

  // Save token to localStorage
  localStorage.setItem("token", admin_token);
  return response.data;
};

const authService = { adminlogin };
export default authService;
