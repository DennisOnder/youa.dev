const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const toolkit = require("../utils/toolkit");
const User = require("../db/models/User");
const validateInput = require("../middleware/validateInput");

// TODO:    =>  Implement the mail module

// ROUTE:   =>  /api/auth/register
// METHOD:  =>  POST
// DESC:    =>  Register a new user
// TODO:    =>  Send out a verification email to the new user
router.post("/register", validateInput, (req, res) => {
  const { email, password } = req.body;
  // Check if user exists via email
  User.findOne({
    where: {
      email
    }
  })
    .then(user => {
      // If there's no user, register a new one
      if (!user) {
        // Hash the password
        bcrypt.hash(password, 14, (err, hash) => {
          if (err) {
            console.log(err);
          } else {
            // Save the user in the database
            User.create({
              email,
              password: hash
            })
              .then(user => {
                return toolkit.handler(req, res, 200, user);
              })
              .catch(err => console.error(err));
          }
        });
        // Send an error message
      } else {
        return toolkit.handler(req, res, 400, "User already exists");
      }
    })
    .catch(err => console.error(err));
});

// ROUTE:   =>  /api/auth/login
// METHOD:  =>  POST
// DESC:    =>  Log in
router.post("/login", validateInput, (req, res) => {
  const { email, password } = req.body;
  // Check if user exists within the database
  User.findOne({
    where: {
      email
    }
  }).then(user => {
    // Send error message if there's no user
    if (!user) {
      return toolkit.handler(req, res, 404, "User not found");
    } else {
      // Compare provided password with the hash
      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          // Log the error if there's an error
          console.error(err);
        } else {
          // If no match, send an error
          if (!match) {
            return toolkit.handler(req, res, 400, "Incorrect password.");
          } else {
            const { type, id, email } = user;
            const payload = {
              type,
              id,
              email
            };
            jwt.sign(
              payload,
              config.SECRET_OR_KEY,
              {
                expiresIn: 86400
              },
              (err, token) => {
                if (err) {
                  console.error(err);
                } else {
                  return toolkit.handler(req, res, 200, {
                    loggedIn: true,
                    token: `Bearer ${token}`
                  });
                }
              }
            );
          }
        }
      });
    }
  });
});

// ROUTE:   =>  /api/auth/current
// METHOD:  =>  GET
// DESC:    =>  Get current user
router.get(
  "/current",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    // Check if user exists
    User.findOne({
      where: {
        id: req.user.id
      }
    }).then(user => {
      if (user) {
        // If user exists, send the user object
        const { id, email, createdAt } = user;
        const response = {
          id,
          email,
          createdAt
        };
        return toolkit.handler(req, res, 200, response);
      } else {
        // Return an error
        return toolkit.handler(req, res, 404, "User not found");
      }
    });
  }
);

// ROUTE:   =>  /api/auth/delete
// METHOD:  =>  DELETE
// DESC:    =>  Delete user
router.delete(
  "/delete",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    // Find an user via ID and then delete it
    User.destroy({
      where: {
        id: req.user.id
      }
    })
      // If the delete request was successful, send out a JSON object with the value of true
      .then(() => {
        return toolkit.handler(req, res, 200, "Account deleted.");
      })
      // Else, log the produced error
      .catch(err => console.error(err));
  }
);

module.exports = router;
