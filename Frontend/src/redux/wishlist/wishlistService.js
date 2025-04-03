import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

API.interceptors.request.use((req) => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const token = JSON.parse(userData).user_token;
    console.log("Sending token:", token);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const createWishlist = (wishData) =>
  API.post("/createwishlist", wishData);
export const getUserWishlist = () => API.get("/getwishlist");
export const deleteWishlist = (id) => API.delete(`wishlist/${id}`);
