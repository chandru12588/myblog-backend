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
      author: req.user.email,
      date: new Date().toDateString(),
      likes: 0,
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
    const blogs = await Blog.find().sort({ _id: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load blogs ❌" });
  }
};

/* ================= GET BLOG BY ID ================= */
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found ❌" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to load blog ❌" });
  }
};

/* ================= GET BLOG BY SLUG (SEO) ================= */
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found ❌" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to load blog ❌" });
  }
};

/* ================= LIKE BLOG ================= */
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!blog) return res.status(404).json({ message: "Blog not found ❌" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Like failed ❌" });
  }
};

/* ================= ADD COMMENT ================= */
export const addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found ❌" });

    blog.comments.push({
      user: req.user.email,
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
    if (!blog) return res.status(404).json({ message: "Blog not found ❌" });

    // 🔐 AUTHOR CHECK
    if (blog.author !== req.user.email) {
      return res.status(403).json({ message: "Not authorized ❌" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.slug = slugify(blog.title, { lower: true });

    // 🧹 DELETE OLD CLOUDINARY IMAGE
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
    if (!blog) return res.status(404).json({ message: "Blog not found ❌" });

    // 🔐 AUTHOR CHECK
    if (blog.author !== req.user.email) {
      return res.status(403).json({ message: "Not authorized ❌" });
    }

    // 🧹 DELETE CLOUDINARY IMAGE
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
