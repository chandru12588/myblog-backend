import Cv from "../models/Cv.js";
import cloudinary from "cloudinary";

/* ================= UPLOAD CV ================= */
export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // delete old CV
    const existing = await Cv.findOne();
    if (existing) {
      await cloudinary.v2.uploader.destroy(existing.publicId, {
        resource_type: "raw",
      });
      await existing.deleteOne();
    }

    const viewUrl = req.file.path; // raw file url

    const downloadUrl = viewUrl.replace(
      "/raw/upload/",
      "/raw/upload/fl_attachment/"
    );

    const cv = await Cv.create({
      viewUrl,
      downloadUrl,
      publicId: req.file.filename,
      uploadedBy: req.user.email,
    });

    res.json({
      viewUrl: cv.viewUrl,
      downloadUrl: cv.downloadUrl,
    });
  } catch (err) {
    console.error("UPLOAD CV ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/* ================= GET CV ================= */
export const getCV = async (_req, res) => {
  const cv = await Cv.findOne();
  if (!cv) return res.json(null);
  res.json(cv);
};

/* ================= DELETE CV ================= */
export const deleteCV = async (req, res) => {
  try {
    const cv = await Cv.findOne();
    if (!cv) {
      return res.status(404).json({ message: "No CV found" });
    }

    await cloudinary.v2.uploader.destroy(cv.publicId, {
      resource_type: "raw",
    });

    await cv.deleteOne();
    res.json({ message: "CV deleted" });
  } catch (err) {
    console.error("DELETE CV ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
