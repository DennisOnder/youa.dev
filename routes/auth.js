const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { SECRET_OR_KEY } = require("../config/config");
const User = require("../db/models/User");
const Profile = require("../db/models/Profile");
const validateInput = require("../middleware/validateInput");
const CustomException = require("../utils/CustomException");

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
router.post("/login", validateInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) throw new CustomException(404, `${email} is not in use.`);
    // Compare provided password with the hash
    const match = bcrypt.compareSync(password, user.password);
    if (!match) throw new CustomException(422, "Invalid password.");
    // Log the user in
    const payload = { type: user.type, id: user.id, email: user.email };
    const token = jwt.sign(payload, SECRET_OR_KEY, {
      expiresIn: "1h"
    });
    return res.status(200).json({ logged_in: true, token: `Bearer ${token}` });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(error.message || "An error has occured.");
  }
});

// ROUTE:   =>  /api/auth/current
// METHOD:  =>  GET
// DESC:    =>  Get current user
router.get(
  "/current",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    const { id, email, createdAt: joined } = req.user;
    const profile = await Profile.findOne({ where: { user_id: id } });
    const response = {
      id,
      email,
      joined,
      profile
    };
    return res.status(200).json(response);
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
    User.destroy({
      where: {
        id: req.user.id
      }
    }).then(() =>
      res.status(200).json({ deleted: true, timestamp: Date.now() })
    );
  }
);

module.exports = router;
