import {
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByRestaurant,
  getProductsByCategory,
  filterProducts
} from "../controller/product_controller.js";

import express from "express";
const router = express.Router();

router.get("/products/search", searchProducts);
router.get("/restaurants/:restaurant_id/products", getProductsByRestaurant);
router.get("/categories/:category_id/products", getProductsByCategory);
router.get("/products", getAllProducts);
router.get("/products/filter",filterProducts)
router.get("/products/:product_id", getProductById);

export default router;