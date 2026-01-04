export const updateBlog = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      content: req.body.content,
    };

    if (req.file) {
      updateData.image = req.file.path; // ✅ Cloudinary URL
    }

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ msg: "Blog Updated ✅", updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update failed ❌" });
  }
};
