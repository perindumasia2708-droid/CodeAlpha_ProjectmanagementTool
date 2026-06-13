const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, description, projectId } = req.body;

    const task = await Task.create({
      title,
      description,
      projectId,
      createdBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      projectId: req.params.projectId,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};