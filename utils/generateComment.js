const inputValidation = require("./validateInput");
const uuid = require("uuid/v4");

module.exports = ({ user, body }) => {
  const inputErrors = inputValidation.comment(body);
  if (inputErrors) return false;
  const { id } = user;
  const { body: commentBody } = body;
  return {
    id: uuid(),
    user_id: id,
    body: commentBody
  };
};
