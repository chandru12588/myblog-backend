import mongoose from "mongoose";

/* ================= COMMENT SCHEMA ================= */
const commentSchema = new mongoose.Schema(
  {
    uid: {
      type: String,       // Firebase UID
      required: true,
    },
    email: {
      type: String,       // commenter email
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }            // keep _id for delete comment
);

/* ================= LIKED BY SCHEMA ================= */
const likedBySchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

/* ================= BLOG SCHEMA ================= */
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    /* 🔐 OWNER (SECURITY) */
    authorId: {
      type: String,       // Firebase UID
      required: true,
      index: true,
    },

    /* 📧 DISPLAY ONLY */
    authorEmail: {
      type: String,
      required: true,
    },

    /* ❤️ LIKES */
    likes: {
      type: Number,
      default: 0,
    },

    likedBy: [likedBySchema],

    /* 💬 COMMENTS */
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
