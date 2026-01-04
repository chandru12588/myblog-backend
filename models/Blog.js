import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true, // email from Firebase
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
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔍 SEO-friendly URL
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

    // 🖼 Cloudinary image URL
    image: {
      type: String,
      default: "",
    },

    // 🔐 Blog author (Firebase email)
    author: {
      type: String,
      required: true,
      index: true,
    },

    date: {
      type: String,
      default: () => new Date().toDateString(),
    },

    likes: {
      type: Number,
      default: 0,
    },

    // 💬 Comments
    comments: [commentSchema],
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

export default mongoose.model("Blog", blogSchema);
