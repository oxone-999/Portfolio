const Project = require("../models/project"); // Import the User model
const cloudinary = require("../utils/cloudinary"); // Import the cloudinary utility
const User = require("../models/user");

// Handle the creation of a new user
const createProject = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    // Upload the image to cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "photos",
    });

    const project = new Project({
      title: title,
      projectDescription: description,
      thumbnail: {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      },
    });

    const savedDocument = await project.save();
    res.json({ savedDocument });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving document");
  }
};

const updateProject = async (req, res) => {
  const projectId = req.params.id;
  const updatedData = req.body;

  try {
    const existingProject = await Project.findById(projectId);

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (updatedData.images) {
      const uploadedImage = await cloudinary.uploader.upload(
        updatedData.images,
        {
          folder: "photos",
        }
      );

      const newImage = {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      };

      existingProject.images.push(newImage);
    }

    existingProject.title = updatedData.title || existingProject.title;
    existingProject.projectDescription =
      updatedData.projectDescription || existingProject.projectDescription;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      existingProject,
      { new: true }
    );

    console.log("Updated project:", updatedProject);

    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Error updating project" });
  }
};

const updateProjectLikeShare = async (req, res) => {
  const projectId = req.params.id;
  const { authorId, type } = req.body;

  try {
    const existingUser = await User.findById(authorId);
    const existingProject = await Project.findById(projectId);

    console.log(existingUser);
    console.log(existingProject);

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    } else if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let isLiked = true;

    // update the existing user likes and shares
    if (type === "like") {
      // if the user already liked the project, remove the like
      if (existingUser.likes.includes(projectId)) {
        existingUser.likes = existingUser.likes.filter(
          (like) => like !== projectId
        );
        isLiked = false;
      } else existingUser.likes.push(projectId);
    } else if (type === "share") {
      existingUser.shares.push(projectId);
    }

    // update the existing project likes and shares
    if (type === "like") {
      // if the project already liked the user, remove the like
      if (existingProject.likes.includes(authorId)) {
        existingProject.likes = existingProject.likes.filter(
          (like) => like !== authorId
        );
        isLiked = false;
      } else existingProject.likes.push(authorId);
    } else if (type === "share") {
      existingProject.shares.push(authorId);
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      existingProject,
      { new: true }
    );

    const updatedUser = await User.findByIdAndUpdate(authorId, existingUser, {
      new: true,
    });

    console.log("Updated user:", updatedUser);
    console.log("Updated project:", updatedProject);

    if (isLiked) res.json({ updatedUser, result: "liked" });
    else res.json({ updatedUser, result: "unliked" });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Error updating project" });
  }
};

const updateThumbnail = async (req, res) => {
  const projectId = req.params.id;
  const { thumbnail } = req.body;

  try {
    const uploadedImage = await cloudinary.uploader.upload(thumbnail, {
      folder: "photos",
    });

    const newImage = {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    };

    //find the project
    const existingProject = await Project.findById(projectId);

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    //replace the old thumbnail with the new one
    existingProject.thumbnail = newImage;

    //update the project thumbnail
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      existingProject,
      { new: true }
    );

    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Error updating project" });
  }
};

const updateWork = async (req, res) => {
  const projectId = req.params.id;
  const { companyName, role, points, skills } = req.body;
  try {
    const newWork = {
      companyName,
      role,
      points,
      skills
    }

    console.log(newWork);

    const existingProject = await Project.findById(projectId);

    console.log(existingProject);

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    existingProject.projectDescription = newWork;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      existingProject,
      { new: true }
    );

    res.json(updatedProject);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createProject,
  updateProject,
  updateProjectLikeShare,
  updateThumbnail,
  updateWork
};
