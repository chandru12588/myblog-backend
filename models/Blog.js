import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: String, // commenter email
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
  { _id: false }
);

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

    // 🔐 OWNER ID (Firebase UID)
    authorId: {
      type: String,
      required: true,
      index: true,
    },

    // 📧 For display only
    authorEmail: {
      type: String,
      required: true,
    },

    // ❤️ Likes count
    likes: {
      type: Number,
      default: 0,
    },

    // ❤️ Who liked (secure)
    likedBy: [likedBySchema],

    // 💬 Comments
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
