const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const inputValidation = require("../utils/validateInput");
const toolkit = require("../utils/toolkit");
const Report = require("../db/models/Report");
const User = require("../db/models/User");
const Ticket = require("../db/models/Ticket");

// TODO:    =>  Implement the mail module

// ROUTE:   =>  /api/support/report
// METHOD:  =>  POST
// DESC:    =>  Report an user
// TODO:    =>  Send out a confirmation email to the user
router.post(
  "/report",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const inputErrors = inputValidation.report(req.body);
    if (!inputErrors) {
      Report.create({
        user_id: req.user.id,
        reported_user_id: req.body.reported_user_id,
        reason: req.body.reason,
        body: req.body.body
      }).then(report => {
        if (report) {
          return toolkit.handler(req, res, 200, report);
        } else {
          return toolkit.handler(req, res, 400, "An error has occured.");
        }
      });
    } else {
      return toolkit.handler(req, res, 400, inputErrors);
    }
  }
);

// ROUTE:   =>  /api/support/ticket
// METHOD:  =>  POST
// DESC:    =>  Support tickets
// TODO:    =>  Send out a confirmation email to the user
router.post(
  "/ticket",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const inputErrors = inputValidation.ticket(req.body);
    if (!inputErrors) {
      Ticket.create({
        user_id: req.user.id,
        subject: req.body.subject,
        body: req.body.body
      }).then(ticket => {
        if (ticket) {
          return toolkit.handler(req, res, 200, ticket);
        } else {
          return toolkit.handler(req, res, 400, "An error has occured.");
        }
      });
    } else {
      return toolkit.handler(req, res, 400, inputErrors);
    }
  }
);

// ROUTE:   =>  /api/support/password
// METHOD:  =>  PATCH
// DESC:    =>  Password Recovery
// TODO:    =>  Mailing system, replace query with an actual recovery token
router.patch("/password", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      const inputErrors = inputValidation.password(req.body);
      if (!inputErrors) {
        bcrypt.hash(req.body.password, 10, (err, encrypted) => {
          if (err) {
            return toolkit.handler(req, res, 400, "An error has occured.");
          } else {
            user
              .update({
                password: encrypted
              })
              .then(result => {
                return toolkit.handler(req, res, 200, result);
              })
              .catch(err => console.error(err));
          }
        });
      } else {
        return toolkit.handler(req, res, 400, inputErrors);
      }
    } else {
      return toolkit.handler(req, res, 404, "User has not been found.");
    }
  });
});

module.exports = router;
