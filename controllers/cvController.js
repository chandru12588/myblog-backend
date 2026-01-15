import Cv from "../models/Cv.js";
import cloudinary from "../config/cloudinary.js"; // ✅ USE CONFIGURED INSTANCE

/* ================= UPLOAD CV ================= */
export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // delete old CV if exists
    const existing = await Cv.findOne();
    if (existing) {
      await cloudinary.uploader.destroy(existing.publicId, {
        resource_type: "raw",
      });
      await existing.deleteOne();
    }

    // RAW PDF URL (view)
    const viewUrl = req.file.path;

    // FORCE DOWNLOAD URL
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

  res.json({
    viewUrl: cv.viewUrl,
    downloadUrl: cv.downloadUrl,
  });
};

/* ================= DELETE CV ================= */
export const deleteCV = async (_req, res) => {
  try {
    const cv = await Cv.findOne();
    if (!cv) {
      return res.status(404).json({ message: "No CV found" });
    }

    await cloudinary.uploader.destroy(cv.publicId, {
      resource_type: "raw",
    });

    await cv.deleteOne();
    res.json({ message: "CV deleted" });
  } catch (err) {
    console.error("DELETE CV ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
