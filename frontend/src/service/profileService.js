import API from "../api/axios";

export const getProfile = async () => {
  const res = await API.get("/profile");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await API.put("/profile", data);
  return res.data;
};