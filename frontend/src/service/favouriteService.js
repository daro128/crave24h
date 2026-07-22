import API from "../Api/axios.js";
// restaurants

export const getFavouriteRestaurants = () => {
  return API.get("/favourites/restaurants");
};

export const addFavouriteRestaurant = (restaurant_id) => {
  return API.post("/favourites/restaurants", {
    restaurant_id,
  });
};

export const removeFavouriteRestaurant = (restaurant_id) => {
  return API.delete(`/favourites/restaurants/${restaurant_id}`);
};
// products

export const getFavouriteProducts = () => {
  return API.get("/favourites/products");
};

export const addFavouriteProduct = (product_id) => {
  return API.post("/favourites/products", {
    product_id,
  });
};

export const removeFavouriteProduct = (product_id) => {
  return API.delete(`/favourites/products/${product_id}`);
};