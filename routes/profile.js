const router = require("express").Router();
const passport = require("passport");
const inputValidation = require("../utils/validateInput");
const Profile = require("../db/models/Profile");
const Post = require("../db/models/Post");
const CustomException = require("../utils/CustomException");
const generateHandle = require("../utils/generateHandle");

// ROUTE:   =>  /api/profile/create
// METHOD:  =>  POST
// DESC:    =>  Create a new profile
router.post(
  "/create",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    try {
      const inputErrors = inputValidation.profile(req.body);
      if (inputErrors) throw new CustomException(400, inputErrors);
      const profile = await Profile.findOne({
        where: {
          user_id: req.user.id
        }
      });
      if (profile)
        throw new CustomException(403, "You already have a profile.");
      const handle = generateHandle(
        `${req.body.firstName
          .toLowerCase()
          .replace(" ", "")}-${req.body.lastName
          .toLowerCase()
          .replace(" ", "")}`
      );
      const newProfile = await Profile.create({
        user_id: req.user.id,
        handle,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        profilePicture: req.body.profilePicture,
        website: req.body.website,
        github: req.body.github,
        linkedin: req.body.linkedin,
        dev: req.body.dev,
        stackoverflow: req.body.stackoverflow,
        biography: req.body.biography
      });
      return res.status(200).json(newProfile);
    } catch (error) {
      return res
        .status(error.status || 500)
        .json(error.message || "An error has occured.");
    }
  }
);

// ROUTE:   =>  /api/profile/get/:handle
// METHOD:  =>  GET
// DESC:    =>  Get user's profile via handle
router.get("/get/:handle", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: {
        handle: req.params.handle
      }
    });
    if (!profile) throw new CustomException(404, "Profile not found.");
    const posts = await Post.findAll({ where: { user_id: profile.user_id } });
    return res.status(200).json({ profile, posts });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(error.message || "An error has occured.");
  }
});

// ROUTE:   =>  /api/profile/edit
// METHOD:  =>  PUT
// DESC:    =>  Edit user's profile
router.put(
  "/edit",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    try {
      const inputErrors = inputValidation.profile(req.body);
      if (inputErrors) throw new CustomException(400, inputErrors);
      const profile = await Profile.findOne({
        where: {
          user_id: req.user.id
        }
      });
      if (!profile)
        throw new CustomException(404, "You do not have a profile.");
      const handle = generateHandle(
        `${req.body.firstName
          .toLowerCase()
          .replace(" ", "")}-${req.body.lastName
          .toLowerCase()
          .replace(" ", "")}`
      );
      profile
        .update({
          handle,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          profilePicture: req.body.profilePicture,
          website: req.body.website,
          github: req.body.github,
          linkedin: req.body.linkedin,
          dev: req.body.dev,
          stackoverflow: req.body.stackoverflow,
          biography: req.body.biography
        })
        .then(res => res.status(200).json(res));
    } catch (error) {
      return res
        .status(error.status || 500)
        .json(error.message || "An error has occured.");
    }
  }
);

// ROUTE:   =>  /api/profile/delete
// METHOD:  =>  DELETE
// DESC:    =>  Delete profile
router.delete(
  "/delete",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
      where: {
        user_id: req.user.id
      }
    }).then(profile => {
      profile.destroy().then(() => {
        return res.status(200).json(profile);
      });
    });
  }
);

// ROUTE:   =>  /api/profile/follow/:handle/
// METHOD:  =>  PUT
// DESC:    =>  Follow or un-follow a profile
router.put(
  "/follow/:handle",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({
        where: { handle: req.params.handle }
      });
      if (!profile) throw new CustomException(404, "Profile not found.");
      // Check if the user is trying to follow it's own account.
      if (profile.user_id === req.user.id)
        throw new CustomException(400, "You cannot follow your own profile.");
      // Parse and iterate over followers, then handle the request
      let followers = JSON.parse(profile.followers);
      if (!Array.isArray(followers)) followers = [];
      followers.includes(req.user.id)
        ? followers.splice(followers.indexOf(req.user.id), 1)
        : followers.push(req.user.id);
      profile
        .update({ followers: JSON.stringify(followers) })
        .then(profile => res.status(200).json(profile));
    } catch (error) {
      return res
        .status(error.status || 500)
        .json(error.message || "An error has occured.");
    }
  }
);

module.exports = router;
