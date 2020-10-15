const Projects = require("../models/Projects");
const Tasks = require("../models/Tasks");

exports.addTask = async (req, res, next) => {
  const url = req.params.url;
  const project = await Projects.findOne({ where: { url } });

  const { task } = req.body;

  const status = 0;
  const projectId = project.id;

  const result = await Tasks.create({ task, status, projectId });

  if (!result) {
    return next();
  }

  res.redirect(`/projects/${url}`);
};

exports.changeTaskStatus = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const task = await Tasks.findOne({ where: { id } });
  task.status = !task.status;
  const result = await task.save();
  if (!result) {
    return next();
  }
  res.status(200).send("Updated");
};

exports.deleteTask = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const result = await Tasks.destroy({ where: { id } });
  if (!result) {
    return next();
  }
  res.status(200).send(`Task id: ${id} was deleted successful`);
};
