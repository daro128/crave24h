import express from "express";
import { login,register,refreshToken } from "../controller/auth_controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh", refreshToken);
export default router;