const Project = require("../models/project"); // Import the User model
const cloudinary = require("../utils/cloudinary"); // Import the cloudinary utility

// Handle the creation of a new user
const createProject = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const project = new Project({
      title: title,
      projectDescription: description,
    });

    const savedDocument = await project.save();
    res.send(savedDocument);
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


module.exports = {
  createProject,
  updateProject,
};
