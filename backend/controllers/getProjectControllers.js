const Project = require('../models/project');

exports.getImages = async (req, res) => {
    try {
      const projects = await Project.find({}).exec();
      res.send({ projects });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error retrieving images' });
    }
  };

exports.getImageById = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).exec();
      res.send({ project });
      console.log(project);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error retrieving image' });
    }
  };