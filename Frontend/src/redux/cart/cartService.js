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

export const addToCart = async (cartItem) => {
  const response = await API.post("/addtocart", cartItem);
  return response.data; 
};
export const getUserCart = async () => {
  const response = await API.get("/getcart"); 
  return response.data; 
  
  
}

export const deleteCartItem = async (pid) => {
  const response = await API.put(`/deletecartitem/${pid}`);
  return response.data; 
  
  
}

export const deleteCart = async () => {
  const response = await API.delete("/deletecart");
  return response.data; 
}

export const decreaseQuantity = async (pid) => {
  const response = await API.put(`/decreaseQuantity/${pid}`);
  return response.data; 
}