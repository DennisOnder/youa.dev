const validator = require("validator");

class ValidateInput {
  constructor() {
    this.errors = {};
    this.reset = this.reset.bind(this);
    this.check = this.check.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.post = this.post.bind(this);
    this.password = this.password.bind(this);
    this.ticket = this.ticket.bind(this);
    this.message = this.message.bind(this);
  }
  reset() {
    this.errors = {};
  }
  check() {
    if (Reflect.ownKeys(this.errors).length > 0) {
      return this.errors;
    } else {
      return false;
    }
  }
  login(data) {
    this.reset();
    if (validator.isEmpty(data.email)) {
      this.errors.emailEmpty = "Please provide an email address.";
    }
    if (!validator.isEmail(data.email)) {
      this.errors.invalidEmail = "Please provide a valid email address.";
    }
    if (validator.isEmpty(data.password)) {
      this.errors.passwordEmpty = "Please provide a password.";
    }
    return this.check();
  }
  register(data) {
    this.reset();
    if (validator.isEmpty(data.email)) {
      this.errors.emailEmpty = "Please provide an email address.";
    }
    if (!validator.isEmail(data.email)) {
      this.errors.invalidEmail = "Please provide a valid email address.";
    }
    if (validator.isEmpty(data.password)) {
      this.errors.passwordEmpty = "Please provide a password.";
    }
    if (
      !validator.isLength(data.password, {
        min: 8,
        max: 32
      })
    ) {
      this.errors.passwordLength =
        "Your password should be between 8 and 32 characters long.";
    }
    if (data.password !== data.confirmPassword) {
      this.errors.passwordsNotMatching = "Passwords are not matching.";
    }
    return this.check();
  }
  profile(data) {
    this.reset();
    if (validator.isEmpty(data.firstName)) {
      this.errors.firstNameEmpty = "First name is required.";
    }
    if (validator.isEmpty(data.lastName)) {
      this.errors.lastNameEmpty = "Last name is required.";
    }
    return this.check();
  }
  post(data) {
    this.reset();
    if (validator.isEmpty(data.title)) {
      this.errors.titleEmpty = "Post title is required.";
    }
    if (validator.isEmpty(data.body)) {
      this.errors.bodyEmpty = "Post body is required.";
    }
    return this.check();
  }
  comment(data) {
    this.reset();
    if (validator.isEmpty(data.body)) {
      this.errors.commentEmpty = "Empty comments are not allowed.";
    }
    if (
      !validator.isLength(data.body, {
        min: 3,
        max: 200
      })
    ) {
      this.errors.commentLength =
        "Comments should be between 3 and 200 characters long.";
    }
    return this.check();
  }
  password(data) {
    this.reset();
    if (validator.isEmpty(data.password)) {
      this.errors.passwordEmpty = "Please provide a password.";
    }
    if (
      !validator.isLength(data.password, {
        min: 8,
        max: 32
      })
    ) {
      this.errors.passwordLength =
        "Your password should be between 8 and 32 characters long.";
    }
    if (data.password !== data.confirmPassword) {
      this.errors.passwordsNotMatching = "Passwords are not matching.";
    }
    return this.check();
  }
  ticket(data) {
    this.reset();
    if (validator.isEmpty(data.subject)) {
      this.errors.subjectEmpty = "A ticket subject is required.";
    }
    if (validator.isEmpty(data.body)) {
      this.errors.ticketEmpty = "Empty tickets are not allowed.";
    }
    return this.check();
  }
  message(data) {
    this.reset();
    if (validator.isEmpty(data.body)) {
      this.errors.messageEmpty = "You cannot send empty messages.";
    }
    return this.check();
  }
}

module.exports = new ValidateInput();
