import express from "express";
import multer from "multer";
import cloudinaryModule from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogBySlug,      // ✅ SEO
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment          // ✅ Comments
} from "../controllers/blogController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= CLOUDINARY CONFIG ================= */
const cloudinary = cloudinaryModule.v2;

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blogs",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

/* ================= BLOG ROUTES ================= */

/* 🌍 PUBLIC ROUTES */
router.get("/", getBlogs);

// 🔍 SEO FRIENDLY READ MORE
router.get("/slug/:slug", getBlogBySlug);

// 📖 Single blog by ID (used internally)
router.get("/:id", getBlogById);

// ❤️ Like blog
router.patch("/like/:id", likeBlog);

/* 🔐 PROTECTED ROUTES */
router.post(
  "/",
  protect,
  upload.single("image"),
  createBlog
);

router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateBlog
);

router.delete(
  "/:id",
  protect,
  deleteBlog
);

// 💬 Add comment
router.post(
  "/:id/comment",
  protect,
  addComment
);

export default router;
