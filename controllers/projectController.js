import Project from "../models/Project.js";

/* ================= CREATE PROJECT ================= */
export const createProject = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      techStack: req.body.techStack
        ? req.body.techStack.split(",")
        : [],
      liveLink: req.body.liveLink,
      githubLink: req.body.githubLink,
      image: req.file?.path || "",

      ownerId: req.user.uid,
      ownerEmail: req.user.email,

      views: 0,
      likes: 0,
      likedBy: [],
      comments: [],
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Create failed ❌" });
  }
};

/* ================= GET ALL PROJECTS ================= */
export const getProjects = async (_req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
};

/* ================= GET PROJECT (+ VIEW COUNT) ================= */
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found ❌" });
    }

    res.json(project);
  } catch (err) {
    console.error("GET PROJECT ERROR:", err);
    res.status(500).json({ message: "Failed to load project ❌" });
  }
};

/* ================= ❤️ LIKE PROJECT ================= */
export const likeProject = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        "likedBy.uid": { $ne: req.user.uid },
      },
      {
        $inc: { likes: 1 },
        $push: {
          likedBy: {
            uid: req.user.uid,
            email: req.user.email,
          },
        },
      },
      { new: true }
    );

    if (!project) {
      return res.status(400).json({ message: "Already liked ❌" });
    }

    res.json(project);
  } catch (err) {
    console.error("LIKE PROJECT ERROR:", err);
    res.status(500).json({ message: "Like failed ❌" });
  }
};

/* ================= 💔 UNLIKE PROJECT ================= */
export const unlikeProject = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        "likedBy.uid": req.user.uid,
      },
      {
        $inc: { likes: -1 },
        $pull: { likedBy: { uid: req.user.uid } },
      },
      { new: true }
    );

    if (!project) {
      return res.status(400).json({ message: "Not liked yet ❌" });
    }

    res.json(project);
  } catch (err) {
    console.error("UNLIKE PROJECT ERROR:", err);
    res.status(500).json({ message: "Unlike failed ❌" });
  }
};

/* ================= 💬 ADD COMMENT ================= */
export const addProjectComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            uid: req.user.uid,
            email: req.user.email,
            text: req.body.text,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found ❌" });
    }

    res.json(project);
  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ message: "Comment failed ❌" });
  }
};

/* ================= 🗑 DELETE OWN COMMENT ================= */
export const deleteProjectComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.params.commentId,
            uid: req.user.uid,
          },
        },
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found ❌" });
    }

    res.json(project);
  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);
    res.status(500).json({ message: "Delete comment failed ❌" });
  }
};

/* ================= UPDATE PROJECT ================= */
export const updateProject = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        ownerId: req.user.uid,
      },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          techStack: req.body.techStack
            ? req.body.techStack.split(",")
            : [],
          liveLink: req.body.liveLink,
          githubLink: req.body.githubLink,
          image: req.file?.path,
        },
      },
      { new: true }
    );

    if (!project) {
      return res.status(403).json({ message: "Access denied ❌" });
    }

    res.json(project);
  } catch (err) {
    console.error("UPDATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Update failed ❌" });
  }
};

/* ================= DELETE PROJECT ================= */
export const deleteProject = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.uid,
    });

    if (!project) {
      return res.status(403).json({ message: "Access denied ❌" });
    }

    res.json({ message: "Project deleted 🗑️" });
  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err);
    res.status(500).json({ message: "Delete failed ❌" });
  }
};
