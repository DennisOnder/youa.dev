const Sequelize = require("sequelize");
const Database = require("../Database");

const Profile = Database.define("Profile", {
  user_id: {
    type: Sequelize.INTEGER
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  handle: {
    type: Sequelize.STRING
  },
  profilePicture: {
    type: Sequelize.STRING,
    defaultValue:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
  },
  website: {
    type: Sequelize.STRING,
    defaultValue: ""
  },
  github: {
    type: Sequelize.STRING,
    defaultValue: ""
  },
  linkedin: {
    type: Sequelize.STRING,
    defaultValue: ""
  },
  dev: {
    type: Sequelize.STRING,
    defaultValue: ""
  },
  stackoverflow: {
    type: Sequelize.STRING,
    defaultValue: ""
  },
  biography: {
    type: Sequelize.STRING,
    defaultValue: ""
  },
  followers: {
    type: Sequelize.STRING,
    defaultValue: JSON.stringify([])
  }
});

module.exports = Profile;
