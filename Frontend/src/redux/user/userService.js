import axios from "axios";
const BACKEND_URL_REGISTER = "http://localhost:5000/api/v1/register";
const BACKEND_URL_LOGIN = "http://localhost:5000/api/v1/login";
const BACKEND_URL_LOGOUT = "http://localhost:5000/api/v1/logout";
const BACKEND_URL_PROFILE = "http://localhost:5000/api/v1/profile";

// Fetch User Profile
// const getProfile = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     throw new Error("No token available");
//   }
//   const response = await axios.get(BACKEND_URL_PROFILE, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (response.data.success) {
//     return response.data.user;
//   } else {
//     throw new Error(response.data.message || "Failed to fetch profile");
//   }
// };
// Login user
// const login = async (userData) => {
//   const response = await axios.post(BACKEND_URL_LOGIN, userData);
//   if (response.data.token) {
//     localStorage.setItem("token", response.data.token);
//   }
//   return response.data;
// };

// Login user
const login = async (userData) => {
  const response = await axios.post(BACKEND_URL_LOGIN, userData);
  if (response.data.user_token) {
    localStorage.setItem("token", response.data.user_token);
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// Fetch User
const getProfile = async () => {
  let token = localStorage.getItem("token");

  if (!token) {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    token = user.user_token;
  }

  if (!token) {
    throw new Error("No authentication token available");
  }

  const response = await axios.get(BACKEND_URL_PROFILE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.data.success) {
    return response.data.user;
  } else {
    throw new Error(response.data.message || "Failed to fetch profile");
  }
};

// register user
const register = async (userData) => {
  const response = await axios.post(BACKEND_URL_REGISTER, userData, {
    withCredentials: true,
  });
  return response.data;
};

// Logout user
const logout = async () => {
  const response = await axios.get(BACKEND_URL_LOGOUT);
  return response.data.message;
};

const authService = { register, login, logout, getProfile };
export default authService;
