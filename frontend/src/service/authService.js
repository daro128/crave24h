import API from "../api/axios";

// Login
export const login = (email, password,rememberme) => {
  return API.post("/auth/login", {
    email,
    password,
    rememberme
  });
};
// Refresh Token
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }
  const response = await API.post("/auth/refresh", {
    refreshToken,
  });
  return response.data;
}

// Register
export const register = (data) => {
  return API.post("/auth/register", data);
};