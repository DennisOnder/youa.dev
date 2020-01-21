const os = require("os");
const passport = require("passport");
const router = require("express").Router();
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

router.use(adminAuthMiddleware);

// ROUTE:   =>  /api/server/health
// METHOD:  =>  GET
// DESC:    =>  Server health
router.get(
  "/health",
  passport.authenticate("jwt", {
    session: false
  }),
  (_, res) => {
    const response = {
      uptime: os.uptime(),
      cpu: os.cpus(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      usedMemory: os.totalmem() - os.freemem()
    };
    return res.status(200).json(response);
  }
);

module.exports = router;
