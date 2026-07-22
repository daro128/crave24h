import { API_URL } from "../config";

const BASE_URL = `${API_URL}/seller`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const jsonHeaders = () => ({
  "Content-Type": "application/json",
  ...authHeaders(),
});

const toFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  return formData;
};

/* ========================= */
/* PROFILE / SETTINGS */
/* ========================= */

export const getProfile = async () => {
  const res = await fetch(`${BASE_URL}/profile`, { headers: authHeaders() });
  return res.json();
};

export const updateProfile = async (data) => {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateSettings = async (data) => {
  const res = await fetch(`${BASE_URL}/settings`, {
    method: "PUT",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

/* ========================= */
/* MENU */
/* ========================= */

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`, { headers: authHeaders() });
  return res.json();
};

export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`, { headers: authHeaders() });
  return res.json();
};

export const createProduct = async (data) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: authHeaders(),
    body: toFormData(data),
  });
  return res.json();
};

export const updateProduct = async (id, data) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: toFormData(data),
  });
  return res.json();
};

export const toggleProductStatus = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return res.json();
};

export const restockProduct = async (id, amount = 10) => {
  const res = await fetch(`${BASE_URL}/products/${id}/restock`, {
    method: "PATCH",
    headers: jsonHeaders(),
    body: JSON.stringify({ amount }),
  });
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
};

/* ========================= */
/* ORDERS */
/* ========================= */

export const getOrders = async () => {
  const res = await fetch(`${BASE_URL}/orders`, { headers: authHeaders() });
  return res.json();
};

const putOrderAction = async (id, action) => {
  const res = await fetch(`${BASE_URL}/orders/${id}/${action}`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return res.json();
};

export const acceptOrder = (id) => putOrderAction(id, "accept");
export const prepareOrder = (id) => putOrderAction(id, "prepare");
export const sendOrderForDelivery = (id) => putOrderAction(id, "send-for-delivery");
export const cancelOrder = (id) => putOrderAction(id, "cancel");

/* ========================= */
/* REVIEWS */
/* ========================= */

export const getReviews = async () => {
  const res = await fetch(`${BASE_URL}/reviews`, { headers: authHeaders() });
  return res.json();
};

/* ========================= */
/* DASHBOARD */
/* ========================= */

export const getDashboardMetrics = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/metrics`, { headers: authHeaders() });
  return res.json();
};

export const getRevenueChart = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/revenue-chart`, { headers: authHeaders() });
  return res.json();
};

export const getOrdersStream = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/orders-stream`, { headers: authHeaders() });
  return res.json();
};

/* ========================= */
/* ANALYTICS */
/* ========================= */

export const getAnalyticsSummary = async () => {
  const res = await fetch(`${BASE_URL}/analytics/summary`, { headers: authHeaders() });
  return res.json();
};

export const getVolumeTimeline = async (days = 7) => {
  const res = await fetch(`${BASE_URL}/analytics/volume-timeline?days=${days}`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const getSalesMix = async () => {
  const res = await fetch(`${BASE_URL}/analytics/sales-mix`, { headers: authHeaders() });
  return res.json();
};

/* ========================= */
/* PROMOTIONS */
/* ========================= */

export const getPromotions = async () => {
  const res = await fetch(`${BASE_URL}/promotions`, { headers: authHeaders() });
  return res.json();
};

export const createPromotion = async (data) => {
  const res = await fetch(`${BASE_URL}/promotions`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};
