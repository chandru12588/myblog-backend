// ================== LOAD ENV (MUST BE FIRST) ==================
import dotenv from "dotenv";
dotenv.config();

// ================== IMPORTS ==================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cloudinaryModule from "cloudinary";

// ================== ROUTES ==================
import blogRoutes from "./routes/blogRoutes.js";
import projectRoutes from "./routes/projectRoutes.js"; // ✅ ADD THIS

// ================== APP ==================
const app = express();
app.use(cors());
app.use(express.json());

// ================== CLOUDINARY INIT ==================
const cloudinary = cloudinaryModule.v2;

// ✅ DEBUG (REMOVE AFTER CONFIRMATION)
console.log("☁️ Cloudinary ENV CHECK:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING",
});

// ✅ USE SAME VARIABLE NAMES EVERYWHERE
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ================== DATABASE ==================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("📦 MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ================== API ROUTES ==================
app.use("/api/blogs", blogRoutes);
app.use("/api/projects", projectRoutes); // ✅ FIX 404

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
