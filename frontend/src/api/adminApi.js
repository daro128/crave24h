import { API_URL } from "../config";

const BASE_URL = `${API_URL}/admin`;

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
/* USERS */
/* ========================= */

export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, { headers: authHeaders() });
  return res.json();
};

export const createUser = async (data) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateUser = async (id, data) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return res.json();
};

export const toggleUserStatus = async (id) => {
  const res = await fetch(`${BASE_URL}/users/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
  });

  return res.json();
};

/* ========================= */
/* RESTAURANTS */
/* ========================= */

export const getRestaurants = async () => {
  const res = await fetch(`${BASE_URL}/restaurants`, { headers: authHeaders() });
  return res.json();
};

export const createRestaurant = async (data) => {
  const res = await fetch(`${BASE_URL}/restaurants`, {
    method: "POST",
    headers: authHeaders(),
    body: toFormData(data),
  });

  return res.json();
};

export const updateRestaurant = async (id, data) => {
  const res = await fetch(`${BASE_URL}/restaurants/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: toFormData(data),
  });

  return res.json();
};

export const deleteRestaurant = async (id) => {
  const res = await fetch(`${BASE_URL}/restaurants/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return res.json();
};

/* ========================= */
/* DRIVERS */
/* ========================= */

export const getDrivers = async () => {
  const res = await fetch(`${BASE_URL}/deliveries`, { headers: authHeaders() });
  return res.json();
};

export const toggleDriverStatus = async (id) => {
  const res = await fetch(`${BASE_URL}/deliveries/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
  });

  return res.json();
};

export const deleteDriver = async (id) => {
  const res = await fetch(`${BASE_URL}/deliveries/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return res.json();
};

export const updateDriver = async (id, data) => {
  const res = await fetch(`${BASE_URL}/deliveries/${id}`, {
    method: "PUT",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
};

/* ========================= */
/* DASHBOARD */
/* ========================= */

export const getDashboard = async () => {
  const res = await fetch(`${BASE_URL}/dashboard`, { headers: authHeaders() });
  return res.json();
};

/* ========================= */
/* PROFILE */
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