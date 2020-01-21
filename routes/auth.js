const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const toolkit = require("../utils/toolkit");
const User = require("../db/models/User");
const validateInput = require("../middleware/validateInput");

function CustomException(status, message) {
  this.status = status;
  this.message = { error: message };
}

// TODO:    =>  Implement the mail module

// ROUTE:   =>  /api/auth/register
// METHOD:  =>  POST
// DESC:    =>  Register a new user
// TODO:    =>  Send out a verification email to the new user
router.post("/register", validateInput, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user) throw new CustomException(403, `${email} is already in use.`);
    // Hash the password
    const hash = bcrypt.hashSync(password, 14);
    const newUser = await User.create({ email, password: hash });
    return res.status(200).json(newUser);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(error.message || "An error has occured.");
  }
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
