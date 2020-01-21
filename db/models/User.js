const Sequelize = require("sequelize");
const Database = require("../Database");

const User = Database.define("User", {
  type: {
    type: Sequelize.STRING,
    defaultValue: "user"
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  verified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  isBanned: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = User;
