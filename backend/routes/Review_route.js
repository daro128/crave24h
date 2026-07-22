import { getProductReviews ,createReview } from "../controller/review_controller.js";
import { verifyToken } from "../middleware/auth_middleware.js";
import express from "express"

const router = express()
router.post("/reviews",verifyToken,createReview)
router.get("/products/:product_id/reviews", getProductReviews);
export default router