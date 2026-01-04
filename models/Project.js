import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    techStack: [String],
    image: String,
    liveLink: String,
    githubLink: String,

    owner: String, // 🔐 user email from Firebase
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
