const Sequelize = require("sequelize");
const slug = require("slug");
const shortid = require("shortid");

const db = require("../config/db");

const Projects = db.define(
  "projects",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING(100),
    url: Sequelize.STRING(100),
  },
  {
    hooks: {
      beforeCreate(project) {
        const url = slug(project.name).toLowerCase();
        project.url = `${url}-${shortid.generate()}`;
      },
    },
  }
);

module.exports = Projects;
