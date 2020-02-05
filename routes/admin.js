const router = require("express").Router();
const passport = require("passport");
const Ticket = require("../db/models/Ticket");
const Report = require("../db/models/Report");
const User = require("../db/models/User");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// TODO:    =>  Implement mail module
router.use(adminAuthMiddleware);

// ROUTE:   =>  /api/admin/ban/
// METHOD:  =>  PUT
// DESC:    =>  Ban or unban an user
router.put(
  "/ban",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found." });
    user
      .update({ isBanned: !user.isBanned })
      .then(updated => res.status(200).json(updated));
  }
);

// ROUTE:   =>  /api/admin/rank
// METHOD:  =>  PUT
// DESC:    =>  Promote or demote an user to admin
router.put(
  "/rank",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found." });
    user
      .update({ type: user.type === "user" ? "admin" : "user" })
      .then(updated => res.status(200).json(updated));
  }
);

// ROUTE:   =>  /api/admin/tickets
// METHOD:  =>  GET
// DESC:    =>  Get tickets
router.get(
  "/tickets",
  passport.authenticate("jwt", {
    session: false
  }),
  (_, res) => Ticket.findAll().then(tickets => res.status(200).json(tickets))
);

// ROUTE:   =>  /api/admin/reports
// METHOD:  =>  GET
// DESC:    =>  Get reports
router.get(
  "/reports",
  passport.authenticate("jwt", {
    session: false
  }),
  (_, res) => Report.findAll().then(reports => res.status(200).json(reports))
);

// ROUTE:   =>  /api/admin/tickets/resolve/:id
// METHOD:  =>  PUT
// DESC:    =>  Resolve a ticket
router.put(
  "/tickets/resolve/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    const ticket = await Ticket.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });
    ticket
      .update({ resolved: true })
      .then(updated => res.status(200).json(updated));
  }
);

// ROUTE:   =>  /api/admin/reports/resolve/:id
// METHOD:  =>  PUT
// DESC:    =>  Resolve a report
router.put(
  "/reports/resolve/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  async (req, res) => {
    const report = await Report.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!report) return res.status(404).json({ error: "Report not found." });
    report
      .update({ resolved: true })
      .then(updated => res.status(200).json(updated));
  }
);

module.exports = router;
