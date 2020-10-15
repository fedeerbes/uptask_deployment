const express = require("express");
const router = express.Router();

// express validator import
const { body } = require("express-validator");

// controller import
const projectController = require("../controllers/projectController");
const taskController = require("../controllers/taskController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

module.exports = function () {
  router.get("/", authController.userAuthenticated, projectController.home);
  router.get(
    "/new-project",
    authController.userAuthenticated,
    projectController.projectForm
  );
  router.post(
    "/new-project",
    authController.userAuthenticated,
    body("name").not().isEmpty().trim().escape(),
    projectController.newProject
  );

  // list projects
  router.get(
    "/projects/:url",
    authController.userAuthenticated,
    projectController.projectUrl
  );

  // update project
  router.get(
    "/project/edit/:id",
    authController.userAuthenticated,
    projectController.editForm
  );
  router.post(
    "/new-project/:id",
    authController.userAuthenticated,
    body("name").not().isEmpty().trim().escape(),
    projectController.updateProject
  );

  // delete project
  router.delete(
    "/projects/:url",
    authController.userAuthenticated,
    projectController.deleteProject
  );

  // tasks
  router.post(
    "/projects/:url",
    authController.userAuthenticated,
    taskController.addTask
  );
  // update task
  router.patch(
    "/tasks/:id",
    authController.userAuthenticated,
    taskController.changeTaskStatus
  );
  // delete task
  router.delete(
    "/tasks/:id",
    authController.userAuthenticated,
    taskController.deleteTask
  );

  // create new account
  router.get("/create-account", userController.createUserForm);
  router.post("/create-account", userController.createUser);
  router.get("/confirm/:email", userController.confirmAccount);

  // login
  router.get("/login", userController.formLogin);
  router.post("/login", authController.authUser);

  //logout
  router.get("/logout", authController.logout);

  // reset password
  router.get("/reset-password", userController.formResetPassword);
  router.post("/reset-password", authController.sendToken);
  router.get("/reset-password/:token", authController.validateToken);
  router.post("/reset-password/:token", authController.updatePassword);

  return router;
};
