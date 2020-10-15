const passport = require("passport");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt-nodejs");

const Users = require("../models/Users");
const Op = Sequelize.Op;
const sendEmail = require("../handlers/email");

exports.authUser = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  badRequestMessage: "Please enter your credentials",
});

// check if user is authenticated
exports.userAuthenticated = (req, res, next) => {
  // if user is authenticated move forward
  if (req.isAuthenticated()) {
    return next();
  }

  // if not redirect to login
  return res.redirect("/login");
};

exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.sendToken = async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ where: { email } });

  if (!user) {
    req.flash("error", "Account doesn't exist");
    res.redirect("/reset-password");
  }

  user.token = crypto.randomBytes(20).toString("hex");
  user.expiration = Date.now() + 3600000;

  await user.save();

  const resetUrl = `${req.headers.host}/reset-password/${user.token}`;

  // send email with token
  await sendEmail.send({
    user,
    subject: "Reset Password",
    resetUrl,
    file: "reset-password",
  });

  req.flash("success", "We sent you an email to change your password");
  res.redirect("/login");
};

exports.validateToken = async (req, res) => {
  const { token } = req.params;
  const user = await Users.findOne({ where: { token } });

  if (!user) {
    req.flash("error", "Invalid action");
    res.redirect("/reset-password");
  }

  res.render("resetPasswordForm", {
    pageTitle: "Reset Password",
  });
};

exports.updatePassword = async (req, res) => {
  // verifies token and expiration date
  const { token } = req.params;
  const user = await Users.findOne({
    where: {
      token,
      expiration: {
        [Op.gte]: Date.now(),
      },
    },
  });

  if (!user) {
    req.flash("error", "Invalid action");
    res.redirect("/reset-password");
  }

  // hash new password
  user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

  // remove token and expiration
  user.token = null;
  user.expiration = null;

  await user.save();

  req.flash("success", "Password updated correctly");
  res.redirect("/login");
};
