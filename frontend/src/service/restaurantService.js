import API from "../api/axios";

export const getAllRestaurants = () => {
  return API.get("/restaurants");
};

export const getRestaurantById = (id) => {
  return API.get(`/restaurants/${id}`);
};
