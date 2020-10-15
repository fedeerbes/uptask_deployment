const Projects = require("../models/Projects");
const Tasks = require("../models/Tasks");

exports.home = async (_, res) => {
  const userId = res.locals.user.id;
  const projects = await Projects.findAll({ where: { userId } });
  res.render("index", {
    pageTitle: "Projects",
    projects,
  });
};

exports.projectForm = async (_, res) => {
  const userId = res.locals.user.id;
  const projects = await Projects.findAll({ where: { userId } });
  res.render("newProject", {
    pageTitle: "New Project",
    projects,
  });
};

exports.newProject = async (req, res) => {
  const userId = res.locals.user.id;
  const projects = await Projects.findAll({ where: { userId } });
  const { name } = req.body;

  let errors = [];

  if (!name) {
    errors.push({ text: "Add project name" });
  }

  if (errors.length) {
    res.render("newProject", {
      pageTitle: "New Project",
      errors,
      projects,
    });
  } else {
    const userId = res.locals.user.id;
    await Projects.create({ name, userId });
    res.redirect("/");
  }
};

exports.updateProject = async (req, res) => {
  const id = req.params.id;
  const userId = res.locals.user.id;
  const projects = await Projects.findAll({ where: { userId } });

  const { name } = req.body;

  let errors = [];

  if (!name) {
    errors.push({ text: "Add project name" });
  }

  if (errors.length) {
    res.render("newProject", {
      pageTitle: "New Project",
      errors,
      projects,
    });
  } else {
    await Projects.update({ name }, { where: { id } });
    res.redirect("/");
  }
};

exports.projectUrl = async (req, res, next) => {
  const url = req.params.url;
  const userId = res.locals.user.id;
  const projectsPromise = Projects.findAll({ where: { userId } });
  const projectPromise = Projects.findOne({ where: { url } });

  const [projects, project] = await Promise.all([
    projectsPromise,
    projectPromise,
  ]);

  const tasks = await Tasks.findAll({ where: { projectId: project.id } });

  if (!project) {
    return next();
  }
  res.render("tasks", {
    pageTitle: "Project Tasks",
    projects,
    project,
    tasks,
  });
};

exports.editForm = async (req, res) => {
  const id = req.params.id;
  const userId = res.locals.user.id;
  const projectsPromise = await Projects.findAll({ where: { userId } });
  const projectPromise = Projects.findOne({ where: { id } });

  const [projects, project] = await Promise.all([
    projectsPromise,
    projectPromise,
  ]);

  res.render("newProject", {
    pageTitle: "Edit Project",
    projects,
    project,
  });
};

exports.deleteProject = async (req, res, next) => {
  const { urlProject } = req.query;

  const result = await Projects.destroy({ where: { url: urlProject } });

  if (!result) {
    return next();
  }

  res.status(200).send("deleted");
};
