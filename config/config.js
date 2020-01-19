require("dotenv").config();

module.exports = {
  DB_PORT: process.env.DB_PORT || 5432,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USER_NAME: process.env.DB_USER_NAME,
  DB_USER_PASSWORD: process.env.DB_USER_PASSWORD || "",
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_AUTH_USER: process.env.MAIL_AUTH_USER,
  MAIL_AUTH_PASSWORD: process.env.MAIL_AUTH_PASSWORD,
  SERVER_PORT: process.env.PORT || 8000,
  SECRET_OR_KEY: process.env.SECRET_OR_KEY
};
