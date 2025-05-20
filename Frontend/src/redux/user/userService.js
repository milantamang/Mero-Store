import axios from "axios";
const BACKEND_URL_REGISTER = "http://localhost:5000/api/v1/register";
const BACKEND_URL_LOGIN = "http://localhost:5000/api/v1/login";
const BACKEND_URL_LOGOUT = "http://localhost:5000/api/v1/logout";
const BACKEND_URL_PROFILE = "http://localhost:5000/api/v1/profile";
const BACKEND_URL_CHANGE_PASSWORD = "http://localhost:5000/api/v1/change-password";
const BACKEND_URL_VERIFICATION_REQUEST = "http://localhost:5000/api/v1/sendverificationemail";
const BACKEND_URL_VERIFY_EMAIL = "http://localhost:5000/api/v1/verifyemail";

// Login user
const login = async (userData) => {
  const response = await axios.post(BACKEND_URL_LOGIN, userData);
  if (response.data.user_token) {
    localStorage.setItem("token", response.data.user_token);
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};


const updateProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(BACKEND_URL_PROFILE, profileData, config);
  return response.data;
};

const changePassword = async (currentPassword, newPassword) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(BACKEND_URL_CHANGE_PASSWORD, {currentPassword,newPassword}, config);
  return response.data;
};


// register user
const register = async (userData) => {
  const response = await axios.post(BACKEND_URL_REGISTER, userData, {
    withCredentials: true,
  });
  return response.data;
};

 //Logout user
const logout = async () => {
  const response = await axios.get(BACKEND_URL_LOGOUT);
  return response.data.message;
};

const sendVerificationRequest = async (email) => {
  const token = localStorage.getItem("token");
   const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(BACKEND_URL_VERIFICATION_REQUEST, {email} , config);
  return response.data;
}

// Verify email
const verifyEmail = async (userId, token) => {
  const response = await axios.post(`${BACKEND_URL_VERIFY_EMAIL}/${userId}/${token}`);
  return response.data;
};

const authService = { register, login, logout, updateProfile, sendVerificationRequest,verifyEmail,changePassword };
export default authService;
