import API from "../api/axios";

export const createOrder = (data) => {
  return API.post("/orders", data);
};

export const getOrders = () => {
  return API.get("/orders");
};

export const getOrderById = (id) => {
  return API.get(`/orders/${id}`);
};

export const trackOrder = (id) => {
  return API.get(`/orders/${id}/status`);
};