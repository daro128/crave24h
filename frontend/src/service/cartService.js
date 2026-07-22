
import API from "../api/axios";

export const addToCart = (data) => {
  return API.post("/cart/add", data);
};

export const getCart = () => {
  return API.get("/cart");
};

export const updateCartItem = (id, data) => {
  return API.put(`/cart/items/${id}`, data);
};

export const deleteCartItem = (id) => {
  return API.delete(`/cart/items/${id}`);
};