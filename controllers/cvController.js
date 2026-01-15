import Cv from "../models/Cv.js";
import cloudinary from "cloudinary";

/* ================= UPLOAD CV ================= */
export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 🔴 Delete existing CV (only one CV allowed)
    const existing = await Cv.findOne();
    if (existing) {
      await cloudinary.v2.uploader.destroy(existing.publicId, {
        resource_type: "raw",
      });
      await existing.deleteOne();
    }

    // ✅ IMPORTANT: use correct public_id
    const cv = await Cv.create({
      url: req.file.path,                 // Cloudinary secure_url
      publicId: req.file.filename,         // Cloudinary public_id
      uploadedBy: req.user.email,
    });

    res.status(201).json({
      message: "CV uploaded successfully",
      cvUrl: cv.url,
    });
  } catch (err) {
    console.error("UPLOAD CV ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/* ================= GET CV ================= */
export const getCV = async (_req, res) => {
  try {
    const cv = await Cv.findOne();
    if (!cv) return res.json(null);
    res.json(cv);
  } catch (err) {
    res.status(500).json({ message: "Failed to load CV" });
  }
};

/* ================= DELETE CV ================= */
export const deleteCV = async (_req, res) => {
  try {
    const cv = await Cv.findOne();
    if (!cv) {
      return res.status(404).json({ message: "No CV found" });
    }

    await cloudinary.v2.uploader.destroy(cv.publicId, {
      resource_type: "raw",
    });

    await cv.deleteOne();

    res.json({ message: "CV deleted successfully" });
  } catch (err) {
    console.error("DELETE CV ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
