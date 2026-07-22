import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem
} from "../controller/cart_controller.js";
import { verifyToken } from "../middleware/auth_middleware.js";

const route = express.Router();

route.post("/cart/add", verifyToken, addToCart);
route.get("/cart", verifyToken, getCart);
route.put("/cart/items/:cart_item_id", verifyToken, updateCartItem);
route.delete("/cart/items/:cart_item_id", verifyToken, deleteCartItem);

export default route;