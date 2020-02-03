module.exports = {
  response(statusCode, message) {
    if (typeof message === "object" || Array.isArray(message)) {
      return message;
    } else {
      if (statusCode === 200) {
        return {
          success: message
        };
      } else {
        return {
          error: message
        };
      }
    }
  },
  handler(_, responseObject, statusCode, data, _super = false) {
    responseObject.status(statusCode).json(this.response(statusCode, data));
  },
  isAdmin(user) {
    if (user.type === "admin") {
      return true;
    } else {
      return false;
    }
  }
};
