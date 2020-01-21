const inputValidation = require("../utils/validateInput");

module.exports = (req, res, next) => {
  const pathArr = req.path.split("/");
  const endpoint = pathArr[pathArr.length - 1];
  console.log(endpoint);
  const inputErrors = inputValidation[endpoint](req.body);
  console.log(inputErrors);
  if (inputErrors) return res.status(500).json(inputErrors);
  next();
};
