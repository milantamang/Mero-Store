import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

// Make sure this interceptor is correctly adding the token
API.interceptors.request.use((req) => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const token = JSON.parse(userData).user_token;
      console.log("Auth token for wishlist:", token ? token.substring(0, 10) + "..." : "missing");
      req.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Error parsing user data for wishlist:", error);
    }
  } else {
    console.log("No user data in localStorage for wishlist request");
  }
  return req;
});

export const createWishlist = (wishData) =>
  API.post("/createwishlist", wishData);
export const getUserWishlist = () => API.get("/getwishlist");
export const deleteWishlist = (id) => API.delete(`wishlist/${id}`);
