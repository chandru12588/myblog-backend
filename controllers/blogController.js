import Blog from "../models/Blog.js";
import cloudinaryModule from "cloudinary";
import slugify from "slugify";

const cloudinary = cloudinaryModule.v2;

/* ================= CREATE BLOG ================= */
export const createBlog = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const slug = slugify(req.body.title, { lower: true });

    const blog = await Blog.create({
      title: req.body.title,
      slug,
      content: req.body.content,
      image: req.file ? req.file.path : "",
      authorId: req.user.uid,
      authorEmail: req.user.email,
      likes: 0,
      likedBy: [],
      comments: [],
    });

    res.status(201).json({ message: "Blog added ✅", blog });
  } catch (err) {
    console.error("CREATE BLOG ERROR:", err);
    res.status(500).json({ message: "Blog creation failed ❌" });
  }
};

/* ================= GET ALL BLOGS ================= */
export const getBlogs = async (_req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
};

/* ================= GET BLOG BY ID ================= */
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found ❌" });
    }
    res.json(blog);
  } catch (err) {
    console.error("GET BLOG ERROR:", err);
    res.status(500).json({ message: "Failed to load blog ❌" });
  }
};

/* ================= GET BLOG BY SLUG ================= */
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found ❌" });
    }
    res.json(blog);
  } catch (err) {
    console.error("GET BLOG SLUG ERROR:", err);
    res.status(500).json({ message: "Failed to load blog ❌" });
  }
};

/* ================= ❤️ LIKE BLOG ================= */
export const likeBlog = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const blog = await Blog.findOneAndUpdate(
      {
        _id: req.params.id,
        "likedBy.uid": { $ne: req.user.uid },
      },
      {
        $inc: { likes: 1 },
        $push: {
          likedBy: {
            uid: req.user.uid,
            email: req.user.email,
          },
        },
      },
      { new: true }
    );

    if (!blog) {
      return res.status(400).json({ message: "Already liked ❌" });
    }

    res.json(blog);
  } catch (err) {
    console.error("LIKE BLOG ERROR:", err);
    res.status(500).json({ message: "Like failed ❌" });
  }
};

/* ================= 💔 UNLIKE BLOG ================= */
export const unlikeBlog = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const blog = await Blog.findOneAndUpdate(
      {
        _id: req.params.id,
        "likedBy.uid": req.user.uid,
      },
      {
        $inc: { likes: -1 },
        $pull: { likedBy: { uid: req.user.uid } },
      },
      { new: true }
    );

    if (!blog) {
      return res.status(400).json({ message: "Not liked yet ❌" });
    }

    res.json(blog);
  } catch (err) {
    console.error("UNLIKE BLOG ERROR:", err);
    res.status(500).json({ message: "Unlike failed ❌" });
  }
};

/* ================= 💬 ADD COMMENT ================= */
export const addComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            uid: req.user.uid,
            email: req.user.email,
            text: req.body.text,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found ❌" });
    }

    res.json(blog);
  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ message: "Comment failed ❌" });
  }
};

/* ================= UPDATE BLOG ================= */
export const updateBlog = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const slug = slugify(req.body.title, { lower: true });

    const blog = await Blog.findOneAndUpdate(
      {
        _id: req.params.id,
        authorId: req.user.uid,
      },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          slug,
          image: req.file?.path,
        },
      },
      { new: true }
    );

    if (!blog) {
      return res.status(403).json({ message: "Access denied ❌" });
    }

    res.json({ message: "Blog updated ✅", blog });
  } catch (err) {
    console.error("UPDATE BLOG ERROR:", err);
    res.status(500).json({ message: "Update failed ❌" });
  }
};

/* ================= DELETE BLOG ================= */
export const deleteBlog = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      authorId: req.user.uid,
    });

    if (!blog) {
      return res.status(403).json({ message: "Access denied ❌" });
    }

    if (blog.image) {
      const publicId = blog.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    res.json({ message: "Blog deleted 🗑️" });
  } catch (err) {
    console.error("DELETE BLOG ERROR:", err);
    res.status(500).json({ message: "Delete failed ❌" });
  }
};
