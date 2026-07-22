import API from "../api/axios";

// Get all products
export const getAllProducts = () => {
  return API.get("/products");
};

// Get product by ID
export const getProductById = (productId) => {
  return API.get(`/products/${productId}`);
};

// Search products
// Search products
export const searchProducts = (keyword) => {
  return API.get(
    `/products/search?search=${encodeURIComponent(keyword)}`
  );
};

// Get products by restaurant
export const getProductsByRestaurant = (restaurantId) => {
  return API.get(`/restaurants/${restaurantId}/products`);
};

// Get products by category
export const getProductsByCategory = (categoryId) => {
  return API.get(`/categories/${categoryId}/products`);
};
export const filterProducts = (filters = {}) => {
  const params = {};
  if (filters.categories?.length) params.categories = filters.categories.join(",");
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.sort) params.sort = filters.sort;
  if (filters.search) params.search = filters.search;
  return API.get("/products/filter", { params });
};
export const getAllCategories = () => API.get("/categories");
