import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  likeProject,
  unlikeProject,
  addProjectComment,
  deleteProjectComment,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import cloudinaryModule from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinary = cloudinaryModule.v2;

/* ================= CLOUDINARY STORAGE ================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });
const router = express.Router();

/* ================= PUBLIC ================= */
router.get("/", getProjects);

/* ================= ❤️ LIKE / 💔 UNLIKE ================= */
router.patch("/like/:id", protect, likeProject);
router.patch("/unlike/:id", protect, unlikeProject);

/* ================= 💬 COMMENTS ================= */
router.post("/comment/:id", protect, addProjectComment);
router.delete("/comment/:id/:commentId", protect, deleteProjectComment);

/* ================= CRUD ================= */
router.get("/:id", getProjectById); // 👀 view count
router.post("/", protect, upload.single("image"), createProject);
router.put("/:id", protect, upload.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
