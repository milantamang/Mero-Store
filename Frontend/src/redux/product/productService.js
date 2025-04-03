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

export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`products/${id}`);
export const getSearchProduct = (searchQuery) =>
  API.get(`product/search?searchQuery=${searchQuery}`);
