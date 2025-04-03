import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("user")).user_token
    }`;
  }

  return req;
});

export const createCart = (cartData) => API.post("/createcart", cartData);
export const getUserCart = () => API.get("/getcart");
export const deleteUserCart = (id, pid) => API.delete(`deletecart/${id}/${pid}`);
