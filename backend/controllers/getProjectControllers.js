const Project = require("../models/project");

const getImages = async (req, res) => {
  try {
    const projects = await Project.find({}).exec();
    res.send({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving images" });
  }
};

const getImageById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).exec();
    res.send({ project });
    console.log(project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving image" });
  }
};

const getProjectLikes = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id).exec();
    res.send({ likes: project.likes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving likes" });
  }
};

const getProjectShares = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id).exec();
    res.send({ shares: project.shares });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving shares" });
  }
};

module.exports = {
  getImages,
  getImageById,
  getProjectLikes,
  getProjectShares,
};