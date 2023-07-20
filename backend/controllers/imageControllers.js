const Project = require("../models/project"); // Import the User model
const cloudinary = require("../utils/cloudinary"); // Import the cloudinary utility
const mongoose = require("mongoose");

const deleteImage = async (req, res) => {
  try {
    const { projectId, id } = req.params;

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const imageId = new mongoose.Types.ObjectId(id);

    // console.log("projects", project.images[0]._id);
    // console.log("params", imageId);

    // Check if the image exists within the project
    const imageIndex = project.images.findIndex((image) =>
      image._id.equals(imageId)
    );
    if (imageIndex === -1) {
      return res.status(404).json({ error: "Image not found in the project" });
    }

    // Delete the image from Cloudinary
    const publicIdToDelete = project.images[imageIndex].public_id;
    await cloudinary.uploader.destroy(publicIdToDelete);

    // Remove the image from the project's images array
    project.images.splice(imageIndex, 1);
    await project.save();

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  deleteImage,
};
