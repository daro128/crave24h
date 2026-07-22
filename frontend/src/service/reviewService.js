import API from "../api/axios";

export const submitReview = ({ product_id, rating, comment }) => {
  return API.post("/reviews", { product_id, rating, comment });
};

export const getProductReviews = (productId) => {
  return API.get(`/products/${productId}/reviews`);
};
