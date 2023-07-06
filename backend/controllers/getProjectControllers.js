const Project = require('../models/project');

exports.getImages = async (req, res) => {
    try {
      const projects = await Project.find({}).exec();
    //   console.log(projects);
      res.send({ projects });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error retrieving images' });
    }
  };