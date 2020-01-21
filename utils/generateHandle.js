const randomHandleNumber = () =>
  `${Math.floor(Math.random() * 10)}${Math.floor(
    Math.random() * 10
  )}${Math.floor(Math.random() * 10)}`;

module.exports = name => `${name}-${randomHandleNumber()}`;
