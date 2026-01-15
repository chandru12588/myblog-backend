import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    publicId: String,
    viewUrl: String,
    downloadUrl: String,
    uploadedBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("Cv", cvSchema);
