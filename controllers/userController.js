const Users = require("../models/Users");
const sendEmail = require("../handlers/email");

exports.createUserForm = (_, res) => {
  res.render("createAccount", {
    pageTitle: "Create Account",
  });
};

exports.createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    await Users.create({ email, password });

    // create confirmation url
    const confirmUrl = `http://${req.headers.host}/confirm/${email}`;

    // create user object
    const user = {
      email,
    };
    // send email
    await sendEmail.send({
      user,
      subject: "Confirm your UpTask account",
      confirmUrl,
      file: "confirm-account",
    });

    // redirect user
    req.flash(
      "success",
      "An confirmation email was sent to you, please confirm your account."
    );
    res.redirect("/login");
  } catch (error) {
    req.flash(
      "error",
      error.errors.map((error) => error.message)
    );
    res.render("createAccount", {
      pageTitle: "Create Account",
      messages: req.flash(),
      email,
      password,
    });
  }
};

exports.formLogin = async (_, res) => {
  res.render("login", {
    pageTitle: "Login",
  });
};

exports.formResetPassword = async (_, res) => {
  res.render("resetPassword", {
    pageTitle: "Reset Password",
  });
};

exports.confirmAccount = async (req, res) => {
  const { email } = req.params;
  const user = await Users.findOne({ where: { email } });

  if (!user) {
    req.flash("error", "Invalid action");
    res.redirect("/create-account");
  }

  user.active = 1;
  await user.save();

  req.flash("success", "Account confirmed");
  res.redirect("/login");
};
