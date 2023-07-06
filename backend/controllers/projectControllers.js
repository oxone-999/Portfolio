const Project = require('../models/project'); // Import the User model
const cloudinary = require('../utils/cloudinary'); // Import the cloudinary utility

// Handle the creation of a new user
const createProject = async (req, res) => {
  try {
    const { title, skills, github, selectedFile, selectedFile2 } = req.body;

    const images = await cloudinary.uploader.upload(selectedFile, {
      folder: 'photos',
    });

    const preview = await cloudinary.uploader.upload(selectedFile2, {
      folder: 'preview-photos',
    });

    const project = new Project({
      username: title,
      skills,
      github,
      file: {
        public_id: images.public_id,
        url: images.secure_url,
      },
      preview: {
        public_id: preview.public_id,
        url: preview.secure_url,
      },
    });

    console.log(project);

    const savedDocument = await project.save();
    res.send(savedDocument);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error saving document');
  }
};

module.exports = {
  createProject,
};
