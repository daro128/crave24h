import express from "express";
import { getAllCategories } from "../controller/category_controller.js"

const router = express.Router();

router.get("/categories", getAllCategories);

export default router;