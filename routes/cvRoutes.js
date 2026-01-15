import express from "express";
import multer from "multer";
import cloudinaryModule from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { uploadCV, deleteCV } from "../controllers/cvController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const cloudinary = cloudinaryModule.v2;

/* ================= CLOUDINARY STORAGE ================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cv",
    resource_type: "raw", // IMPORTANT for PDF
    allowed_formats: ["pdf"],
  },
});

const upload = multer({ storage });

/* ================= ROUTES ================= */
router.post("/upload", protect, upload.single("cv"), uploadCV);
router.delete("/delete", protect, deleteCV);

export default router;
