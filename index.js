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
import projectRoutes from "./routes/projectRoutes.js";

// ================== APP ==================
const app = express();

/* ================== MIDDLEWARE ================== */
app.use(
  cors({
    origin: true,          // ✅ FIXED CORS
    credentials: true,
  })
);

app.use(express.json());

// ================== CLOUDINARY INIT ==================
const cloudinary = cloudinaryModule.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ================== DATABASE ==================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("📦 MongoDB Connected"))
  .catch((err) => console.error("❌ DB Error:", err.message));

// ================== HEALTH CHECK ==================
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ================== API ROUTES ==================
app.use("/api/blogs", blogRoutes);
app.use("/api/projects", projectRoutes);

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
