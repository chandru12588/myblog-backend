import Project from "../models/Project.js";

/* ================= CREATE PROJECT ================= */
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      techStack: req.body.techStack
        ? req.body.techStack.split(",")
        : [],
      liveLink: req.body.liveLink,
      githubLink: req.body.githubLink,
      image: req.file?.path || "",

      // 🔐 OWNER INFO
      ownerId: req.user.uid,
      ownerEmail: req.user.email,

      views: 0,
      likes: 0,
      likedBy: [],
      comments: [],
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({
      message: "Create failed ❌",
      error: err.message,
    });
  }
};

/* ================= GET ALL PROJECTS ================= */
export const getProjects = async (_req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to load projects ❌" });
  }
};

/* ================= GET SINGLE PROJECT (+ VIEW COUNT) ================= */
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found ❌" });
    }

    // 👀 Increment views
    project.views += 1;
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to load project ❌" });
  }
};

/* ================= LIKE PROJECT ================= */
export const likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found ❌" });
    }

    const alreadyLiked = project.likedBy.find(
      (u) => u.uid === req.user.uid
    );

    if (alreadyLiked) {
      return res.status(400).json({ message: "Already liked ❌" });
    }

    project.likes += 1;
    project.likedBy.push({
      uid: req.user.uid,
      email: req.user.email,
    });

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Like failed ❌" });
  }
};

/* ================= UNLIKE PROJECT ================= */
export const unlikeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found ❌" });
    }

    const index = project.likedBy.findIndex(
      (u) => u.uid === req.user.uid
    );

    if (index === -1) {
      return res
        .status(400)
        .json({ message: "You haven't liked this project ❌" });
    }

    project.likedBy.splice(index, 1);
    project.likes = Math.max(0, project.likes - 1);

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Unlike failed ❌" });
  }
};

/* ================= ADD COMMENT ================= */
export const addProjectComment = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found ❌" });
    }

    project.comments.push({
      uid: req.user.uid,
      email: req.user.email,
      text: req.body.text,
      date: new Date(),
    });

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Comment failed ❌" });
  }
};

/* ================= DELETE OWN COMMENT ================= */
export const deleteProjectComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found ❌" });
    }

    const commentIndex = project.comments.findIndex(
      (c) =>
        c._id.toString() === commentId &&
        c.uid === req.user.uid
    );

    if (commentIndex === -1) {
      return res.status(403).json({ message: "Not authorized ❌" });
    }

    project.comments.splice(commentIndex, 1);
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Delete comment failed ❌" });
  }
};

/* ================= UPDATE PROJECT (OWNER ONLY) ================= */
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found ❌" });
    }

    if (project.ownerId !== req.user.uid) {
      return res.status(403).json({ message: "Access denied ❌" });
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

/* ================= DELETE PROJECT (OWNER ONLY) ================= */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found ❌" });
    }

    if (project.ownerId !== req.user.uid) {
      return res.status(403).json({ message: "Access denied ❌" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted 🗑️" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed ❌" });
  }
};
