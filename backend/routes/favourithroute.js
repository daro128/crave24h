import express from "express";
import {
  addFavouriteRestaurant,
  removeFavouriteRestaurant,
  getFavouriteRestaurants,
  addFavouriteProduct,
  removeFavouriteProduct,
  getFavouriteProducts,
} from "../controller/favouriteController.js";

import {verifyToken} from "../middleware/auth_middleware.js";
const router = express.Router();
/* Restaurant favourites */
router.post("/favourites/restaurants",verifyToken,addFavouriteRestaurant);
router.get("/favourites/restaurants",verifyToken,getFavouriteRestaurants);
router.delete("/favourites/restaurants/:restaurant_id",verifyToken,removeFavouriteRestaurant);
/* Product favourites */
router.post("/favourites/products",verifyToken,addFavouriteProduct);
router.get("/favourites/products",verifyToken,getFavouriteProducts);
router.delete("/favourites/products/:product_id",verifyToken,removeFavouriteProduct);

export default router;