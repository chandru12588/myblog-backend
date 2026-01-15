import Cv from "../models/Cv.js";
import cloudinary from "cloudinary";

/* ================= UPLOAD CV ================= */
export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // remove old CV
    const existing = await Cv.findOne();
    if (existing) {
      await cloudinary.v2.uploader.destroy(existing.publicId, {
        resource_type: "raw",
      });
      await existing.deleteOne();
    }

    const rawUrl = req.file.path;

    // 🔥 FORCE INLINE VIEW URL
    const viewUrl = rawUrl.replace(
      "/raw/upload/",
      "/image/upload/fl_attachment:false/"
    );

    const downloadUrl = `${rawUrl}?dl=1`;

    const cv = await Cv.create({
      rawUrl,
      viewUrl,
      downloadUrl,
      publicId: req.file.filename,
      uploadedBy: req.user.email,
    });

    res.json({
      viewUrl,
      downloadUrl,
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
  const cv = await Cv.findOne();
  if (!cv) return res.status(404).json({ message: "No CV found" });

  await cloudinary.v2.uploader.destroy(cv.publicId, {
    resource_type: "raw",
  });

  await cv.deleteOne();
  res.json({ message: "CV deleted" });
};
