function isAdmin(user) {
  if (user.type === "admin") return true;
  return false;
}

module.exports = (req, res, next) => {
  if (!isAdmin(req.user)) return res.status(403).json("You are not an admin.");
  next();
};
