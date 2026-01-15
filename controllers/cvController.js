import Cv from "../models/Cv.js";
import cloudinary from "../cloudinary.js"; 

/* ================= UPLOAD CV ================= */
export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1. Delete old CV if exists
    const existing = await Cv.findOne();
    if (existing) {
      // 🚩 FIXED: Use resource_type: "image"
      await cloudinary.uploader.destroy(existing.publicId, {
        resource_type: "image",
      });
      await existing.deleteOne();
    }

    // 2. Prepare the View URL
    // Ensure the URL has the .pdf extension so browsers recognize the format
    let viewUrl = req.file.path;
    if (!viewUrl.toLowerCase().endsWith(".pdf")) {
      viewUrl = viewUrl.replace(/\/v\d+\//, (match) => match + req.file.filename + ".pdf");
      // Simpler version if your storage config doesn't include the extension:
      // viewUrl = viewUrl + ".pdf"; 
    }

    // 3. Prepare the Download URL
    // 🚩 FIXED: We replace /image/upload/ (since we are now using image type)
    // Adding 'fl_attachment' forces the browser to download the file
    const downloadUrl = viewUrl.replace(
      "/image/upload/",
      "/image/upload/fl_attachment/"
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

    // 🚩 FIXED: Use resource_type: "image"
    await cloudinary.uploader.destroy(cv.publicId, {
      resource_type: "image",
    });

    await cv.deleteOne();
    res.json({ message: "CV deleted" });
  } catch (err) {
    console.error("DELETE CV ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};