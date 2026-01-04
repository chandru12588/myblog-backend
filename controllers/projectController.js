import Project from "../models/Project.js";

/* ================= CREATE PROJECT ================= */
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      techStack: req.body.techStack.split(","),
      liveLink: req.body.liveLink,
      githubLink: req.body.githubLink,
      image: req.file?.path || "",
      author: req.user.email,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Create failed ❌" });
  }
};

/* ================= GET ALL PROJECTS ================= */
export const getProjects = async (_req, res) => {
  res.json(await Project.find().sort({ createdAt: -1 }));
};

/* ================= GET SINGLE PROJECT ================= */
export const getProjectById = async (req, res) => {
  res.json(await Project.findById(req.params.id));
};

/* ================= UPDATE PROJECT ================= */
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.techStack = req.body.techStack
      ? req.body.techStack.split(",")
      : project.techStack;
    project.liveLink = req.body.liveLink || project.liveLink;
    project.githubLink = req.body.githubLink || project.githubLink;

    if (req.file) {
      project.image = req.file.path;
    }

    const updated = await project.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed ❌" });
  }
};

/* ================= DELETE PROJECT ================= */
export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted 🗑️" });
};
