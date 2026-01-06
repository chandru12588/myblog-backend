import express from "express";
import multer from "multer";
import cloudinaryModule from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
  addComment,
} from "../controllers/blogController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= CLOUDINARY ================= */
const cloudinary = cloudinaryModule.v2;

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blogs",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

/* ================= PUBLIC ================= */
router.get("/", getBlogs);
router.get("/slug/:slug", getBlogBySlug);

/* ================= ❤️ LIKE / 💔 UNLIKE ================= */
router.patch("/like/:id", protect, likeBlog);
router.patch("/unlike/:id", protect, unlikeBlog);

/* ================= 💬 COMMENT ================= */
router.post("/comment/:id", protect, addComment);

/* ================= CRUD (KEEP :id LAST) ================= */
router.get("/:id", getBlogById);
router.post("/", protect, upload.single("image"), createBlog);
router.put("/:id", protect, upload.single("image"), updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
