const router = require("express").Router();
const passport = require("passport");
const toolkit = require("../utils/toolkit");
const inputValidation = require("../utils/validateInput");
const Profile = require("../db/models/Profile");
const Follow = require("../db/models/Follow");
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

// ROUTE:   =>  /api/profile/current
// METHOD:  =>  GET
// DESC:    =>  Get current user's profile
router.get(
  "/current",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
      where: {
        user_id: req.user.id
      }
    })
      .then(profile => {
        if (!profile) {
          return toolkit.handler(req, res, 404, "You do not have a profile.");
        } else {
          return toolkit.handler(req, res, 200, profile);
        }
      })
      .catch(err => console.error(err));
  }
);

// ROUTE:   =>  /api/profile/get/:handle
// METHOD:  =>  GET
// DESC:    =>  Get user's profile via handle
router.get("/get/:handle", (req, res) => {
  Profile.findOne({
    where: {
      handle: req.params.handle
    }
  })
    .then(profile => {
      if (!profile) {
        return toolkit.handler(req, res, 404, "Profile not found.");
      } else {
        Post.findAll({ where: { user_id: profile.user_id } }).then(posts => {
          if (posts) {
            return toolkit.handler(req, res, 200, { profile, posts });
          } else {
            return toolkit.handler(req, res, 200, profile);
          }
        });
      }
    })
    .catch(err => console.error(err));
});

// ROUTE:   =>  /api/profile/edit
// METHOD:  =>  PUT
// DESC:    =>  Edit user's profile
router.put(
  "/edit",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
      where: {
        user_id: req.user.id
      }
    }).then(profile => {
      if (!profile) {
        return toolkit.handler(req, res, 404, "Profile not found.");
      } else {
        profile
          .update({
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
          .then(result => {
            return toolkit.handler(req, res, 200, result);
          })
          .catch(err => console.error(err));
      }
    });
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
    })
      .then(profile => {
        if (profile) {
          profile
            .destroy()
            // If the delete request was successful, send out a JSON object with the value of true
            .then(() => {
              return toolkit.handler(req, res, 200, "Profile deleted.");
            })
            .catch(err => console.error(err));
        } else {
          return toolkit.handler(req, res, 404, "Profile not found.");
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
);

// ROUTE:   =>  /api/profile/follow/:id/
// METHOD:  =>  PUT
// DESC:    =>  Follow or un-follow a profile
router.put(
  "/follow/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const followed_user_id = req.params.id;
    const user_id = req.user.id;
    console.log(followed_user_id, user_id);
    if (user_id === followed_user_id) {
      return toolkit.handler(
        req,
        res,
        403,
        "You cannot follow your own profile."
      );
    } else {
      Follow.findOne({
        where: {
          user_id,
          followed_user_id
        }
      }).then(follow => {
        if (follow) {
          follow
            .destroy()
            .then(() => {
              return toolkit.handler(
                req,
                res,
                200,
                "Profile has been unfollowed."
              );
            })
            .catch(err => console.error(err));
        } else {
          Follow.create({
            user_id,
            followed_user_id
          })
            .then(newFollow => {
              return toolkit.handler(req, res, 200, newFollow);
            })
            .catch(err => console.error(err));
        }
      });
    }
  }
);

// // ROUTE:   =>  /api/profile/followers/:handle
// // METHOD:  =>  GET
// // DESC:    =>  Get followers
router.get("/followers/:handle", (req, res) => {
  Profile.findOne({
    where: {
      handle: req.params.handle
    }
  }).then(profile => {
    if (profile) {
      Follow.findAll({
        where: {
          followed_user_id: profile.user_id
        }
      })
        .then(followers => {
          return toolkit.handler(req, res, 200, followers);
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      return toolkit.handler(req, res, 404, "Profile not found.");
    }
  });
});

module.exports = router;
