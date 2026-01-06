import mongoose from "mongoose";

/* ================= COMMENTS ================= */
const commentSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    email: {
      type: String,
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

/* ================= LIKES ================= */
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

/* ================= PROJECT ================= */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    techStack: [String],

    image: String,
    liveLink: String,
    githubLink: String,

    /* 🔐 OWNER (SECURE) */
    ownerId: {
      type: String, // Firebase UID
      required: true,
      index: true,
    },

    ownerEmail: {
      type: String,
      required: true,
    },

    /* 👀 VIEWS */
    views: {
      type: Number,
      default: 0,
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

export default mongoose.model("Project", projectSchema);
