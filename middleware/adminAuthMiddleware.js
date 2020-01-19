module.exports = (req, res, next) => {
  if (!toolkit.isAdmin(req.user))
    return res.status(403).json("You are not an admin.");
  next();
};
