import cloudinaryModule from "cloudinary";

const cloudinary = cloudinaryModule.v2;

const ADMIN_EMAIL = "chandru.balasub12588@gmail.com";

/* ================= UPLOAD / UPDATE CV ================= */
export const uploadCV = async (req, res) => {
  try {
    if (!req.user || req.user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: "Admin only ❌" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded ❌" });
    }

    return res.json({
      message: "CV uploaded successfully ✅",
      cvUrl: req.file.path, // Cloudinary URL
    });
  } catch (err) {
    console.error("UPLOAD CV ERROR:", err);
    res.status(500).json({ message: "CV upload failed ❌" });
  }
};

/* ================= DELETE CV ================= */
export const deleteCV = async (req, res) => {
  try {
    if (!req.user || req.user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: "Admin only ❌" });
    }

    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ message: "Public ID required ❌" });
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });

    res.json({ message: "CV deleted successfully 🗑" });
  } catch (err) {
    console.error("DELETE CV ERROR:", err);
    res.status(500).json({ message: "CV delete failed ❌" });
  }
};
