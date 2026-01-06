import Blog from "../models/Blog.js";
import cloudinaryModule from "cloudinary";
import slugify from "slugify";

const cloudinary = cloudinaryModule.v2;

/* ================= CREATE BLOG ================= */
export const createBlog = async (req, res) => {
  try {
    const slug = slugify(req.body.title, { lower: true });

    const blog = await Blog.create({
      title: req.body.title,
      slug,
      content: req.body.content,
      image: req.file ? req.file.path : "",

      // 🔐 OWNER INFO
      authorId: req.user.uid,
      authorEmail: req.user.email,

      likes: 0,
      likedBy: [],
      comments: [],
    });

    res.status(201).json({
      message: "Blog added ✅",
      blog,
    });
  } catch (err) {
    res.status(500).json({
      message: "Blog creation failed ❌",
      error: err.message,
    });
  }
};

/* ================= GET ALL BLOGS ================= */
export const getBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load blogs ❌" });
  }
};

/* ================= GET BLOG BY ID ================= */
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ message: "Blog not found ❌" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to load blog ❌" });
  }
};

/* ================= GET BLOG BY SLUG ================= */
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog)
      return res.status(404).json({ message: "Blog not found ❌" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to load blog ❌" });
  }
};

/* ================= LIKE BLOG ================= */
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ message: "Blog not found ❌" });

    const alreadyLiked = blog.likedBy.some(
      (u) => u.uid === req.user.uid
    );

    if (alreadyLiked) {
      return res.status(400).json({ message: "Already liked ❌" });
    }

    blog.likes += 1;
    blog.likedBy.push({
      uid: req.user.uid,
      email: req.user.email,
    });

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Like failed ❌" });
  }
};

/* ================= UNLIKE BLOG ================= */
export const unlikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ message: "Blog not found ❌" });

    const index = blog.likedBy.findIndex(
      (u) => u.uid === req.user.uid
    );

    if (index === -1) {
      return res
        .status(400)
        .json({ message: "You haven't liked this blog ❌" });
    }

    blog.likedBy.splice(index, 1);
    blog.likes = Math.max(0, blog.likes - 1);

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Unlike failed ❌" });
  }
};

/* ================= ADD COMMENT ================= */
export const addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ message: "Blog not found ❌" });

    blog.comments.push({
      uid: req.user.uid,
      email: req.user.email,
      text: req.body.text,
      date: new Date(),
    });

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Comment failed ❌" });
  }
};

/* ================= UPDATE BLOG ================= */
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ message: "Blog not found ❌" });

    // 🔐 OWNER CHECK
    if (blog.authorId !== req.user.uid) {
      return res.status(403).json({ message: "Access denied ❌" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.slug = slugify(blog.title, { lower: true });

    if (req.file && blog.image) {
      const publicId = blog.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
      blog.image = req.file.path;
    }

    await blog.save();
    res.json({ message: "Blog updated ✅", blog });
  } catch (err) {
    res.status(500).json({
      message: "Update failed ❌",
      error: err.message,
    });
  }
};

/* ================= DELETE BLOG ================= */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ message: "Blog not found ❌" });

    // 🔐 OWNER CHECK
    if (blog.authorId !== req.user.uid) {
      return res.status(403).json({ message: "Access denied ❌" });
    }

    if (blog.image) {
      const publicId = blog.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted 🗑️" });
  } catch (err) {
    res.status(500).json({
      message: "Delete failed ❌",
      error: err.message,
    });
  }
};
