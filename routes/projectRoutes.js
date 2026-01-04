import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import cloudinaryModule from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinary = cloudinaryModule.v2;

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });
const router = express.Router();

/* PUBLIC */
router.get("/", getProjects);
router.get("/:id", getProjectById);

/* PROTECTED */
router.post("/", protect, upload.single("image"), createProject);
router.put("/:id", protect, upload.single("image"), updateProject); // ✅ FIX
router.delete("/:id", protect, deleteProject); // ✅ FIX

export default router;
