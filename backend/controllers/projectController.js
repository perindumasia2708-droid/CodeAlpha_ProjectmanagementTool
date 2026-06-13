const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      createdBy: req.user.id,
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({
      message: "Project Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};