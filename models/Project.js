import mongoose from "mongoose";

/* ================= COMMENTS ================= */
const commentSchema = new mongoose.Schema({
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
}); // ✅ _id ENABLED (DEFAULT)

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
  { _id: false } // OK for likes (no delete needed)
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

    /* 🔐 OWNER */
    ownerId: {
      type: String,
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
