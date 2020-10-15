const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Reference model to authenticate
const Users = require("../models/Users");

// local strategy - login with db credentials (user, password)
passport.use(
  new LocalStrategy(
    // default expects user and password
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await Users.findOne({ where: { email, active: 1 } });

        // user exist but password doesn't match
        if (!user.verifyPassword(password)) {
          return done(null, false, {
            message: "Password incorrect",
          });
        }

        // user and password match
        return done(null, user);
      } catch (error) {
        // user doesn't exist
        return done(null, false, {
          message: "Account doesn't exist",
        });
      }
    }
  )
);

// serialize user
passport.serializeUser((user, callback) => callback(null, user));

// deserialize user
passport.deserializeUser((user, callback) => callback(null, user));

module.exports = passport;
