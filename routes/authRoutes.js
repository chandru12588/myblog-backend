import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// 📝 Register User
router.post("/signup", signup);

// 🔐 Login User
router.post("/login", login);

export default router;
