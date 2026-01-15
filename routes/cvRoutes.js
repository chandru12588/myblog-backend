import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js"; // ✅ USE CONFIGURED INSTANCE
import { uploadCV, deleteCV, getCV } from "../controllers/cvController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ✅ RAW upload for PDF */
const storage = new CloudinaryStorage({
  cloudinary, // ✅ NOT cloudinary.v2
  params: {
    folder: "cv",
    resource_type: "raw",        // 🔥 REQUIRED FOR PDF
    allowed_formats: ["pdf"],
    use_filename: true,
    unique_filename: true,
  },
});

const upload = multer({ storage });

router.get("/", getCV);
router.post("/upload", protect, upload.single("cv"), uploadCV);
router.delete("/delete", protect, deleteCV);

export default router;
