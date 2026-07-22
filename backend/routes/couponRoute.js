import express from "express";
import { validateCoupon,createCoupon } from "../controller/couponController.js";
import { verifyToken } from "../middleware/auth_middleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/coupons/validate", validateCoupon);
router.post("/coupons", verifyToken, authorizeRoles("admin"), createCoupon);

export default router;