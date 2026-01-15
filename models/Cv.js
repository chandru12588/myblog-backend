import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: String, // admin email
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cv", cvSchema);
