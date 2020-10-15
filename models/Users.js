const Sequelize = require("sequelize");
const bcrypt = require("bcrypt-nodejs");
const db = require("../config/db");
const Projects = require("./Projects");

const Users = db.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Add valid email",
        },
        notEmpty: { msg: "Email cannot be empty" },
      },
      unique: {
        args: true,
        msg: "User already in use",
      },
    },
    password: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
      },
    },
    active: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    token: Sequelize.STRING,
    expiration: Sequelize.DATE,
  },
  {
    hooks: {
      beforeCreate(user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      },
    },
  }
);

// custom methods
Users.prototype.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

Users.hasMany(Projects);

module.exports = Users;
