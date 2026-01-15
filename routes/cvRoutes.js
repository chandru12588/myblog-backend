import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../cloudinary.js"; 
import { uploadCV, deleteCV, getCV } from "../controllers/cvController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ✅ FIXED: Using 'image' allows browser rendering/preview */
const storage = new CloudinaryStorage({
  cloudinary, 
  params: {
    folder: "cv",
    // 🚩 CHANGE: 'raw' -> 'image'
    // This is the "secret" to making PDFs viewable instead of just downloadable.
    resource_type: "image",      
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