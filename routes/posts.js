const router = require("express").Router();
const passport = require("passport");
const inputValidation = require("../utils/validateInput");
const CustomException = require("../utils/CustomException");
const generateHandle = require("../utils/generateHandle");
const Post = require("../db/models/Post");

// ROUTE:   =>  /api/posts/create
// METHOD:  =>  POST
// DESC:    =>  Create a new post
router.post(
  "/create",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    try {
      const inputErrors = inputValidation.post(req.body);
      if (inputErrors) throw new CustomException(400, inputErrors);
      const post = await Post.create({
        user_id: req.user.id,
        handle: generateHandle(
          `${req.body.title
            .toLowerCase()
            .split(" ")
            .join("-")}`
        ),
        title: req.body.title,
        body: req.body.body
      });
      return res.status(200).json(post);
    } catch (error) {
      return res
        .status(error.status || 500)
        .json(error.message || "An error has occured.");
    }
  }
);

// ROUTE:   =>  /api/posts/get/:handle
// METHOD:  =>  GET
// DESC:    =>  Get a post via handle
router.get("/get/:handle", async (req, res) => {
  const { handle } = req.params;
  const post = await Post.findOne({
    where: {
      handle
    }
  });
  if (!post)
    return res.status(404).json({ error: `No post with the ${handle} found.` });
  return res.status(200).json(post);
});

// ROUTE:   =>  /api/posts/:id/edit
// METHOD:  =>  PUT
// DESC:    =>  Edit a post
router.put(
  "/edit/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });
    if (!post) return res.status(404).json({ error: "Post not found." });
    post
      .update({
        handle: generateHandle(
          `${req.body.title
            .toLowerCase()
            .split(" ")
            .join("-")}`
        ),
        title: req.body.title,
        body: req.body.body
      })
      .then(post => res.status(200).json(post));
  }
);

// ROUTE:   =>  /api/posts/delete/:id
// METHOD:  =>  DELETE
// DESC:    =>  Delete a post
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    })
      .then(post =>
        res
          .status(post ? 200 : 404)
          .json(
            post
              ? { deleted: true, timestamp: Date.now() }
              : { error: "Post not found." }
          )
      )
      .catch(error => res.status(500).json(error));
  }
);

// ROUTE:   =>  /api/posts/comment/:id/
// METHOD:  =>  PUT
// DESC:    =>  Comment on a post
router.put(
  "/comment/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    const post = await Post.findOne({
      where: {
        handle: req.params.id
      }
    });
    if (!post) return res.status(404).json({ error: "Post not found." });
    const inputErrors = inputValidation.comment(req.body);
    if (inputErrors) return res.status(500).json(inputErrors);
    // NOTE: Implement comments
    return res.status(200).json(post.comments);
  }
);

// ROUTE:   =>  /api/posts/comment/edit/:postID/:commentID
// METHOD:  =>  PATCH
// DESC:    =>  Edit a comment
router.patch(
  "/comment/edit/:postID/:commentID",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    const post = await Post.findOne({
      where: {
        handle: req.params.postID
      }
    });
    if (!post) return res.status(404).json({ error: "Post not found." });
    const inputErrors = inputValidation.comment(req.body);
    if (inputErrors) return res.status(500).json(inputErrors);
    // NOTE: Implement comments
    return res.status(200).json(post.comments);
  }
);

// ROUTE:   =>  /api/posts/comment/delete/:postID/:commentID
// METHOD:  =>  DELETE
// DESC:    =>  Delete a comment
router.delete(
  "/comment/delete/:postID/:commentID",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    const post = await Post.findOne({
      where: {
        handle: req.params.postID
      }
    });
    if (!post) return res.status(404).json({ error: "Post not found." });
    // NOTE: Implement comments
    return res.status(200).json(post.comments);
  }
);

// ROUTE:   =>  /api/posts/like/:id
// METHOD:  =>  PATCH
// DESC:    =>  Like or dislike a post
router.patch(
  "/like/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    const post = await Post.findOne({
      where: {
        handle: req.params.id
      }
    });
    if (!post) return res.status(404).json({ error: "Post not found." });
    // NOTE: Implement likes
    return res.status(200).json(post.likes);
  }
);

module.exports = router;
