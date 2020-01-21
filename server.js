const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const config = require("./config/config");
const socketHandler = require("./socketHandler");

// App
const app = express();

// Route imports
const testRoute = require("./routes/test");
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const postsRoute = require("./routes/posts");
const supportRoute = require("./routes/support");
const adminRoute = require("./routes/admin");

// Body Parser
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Passport
app.use(passport.initialize());
require("./config/passport")(passport);

// FIXME: => CORS - Remove before deployment
const cors = require("cors");
app.use(cors());

// Routes
app.use("/api/test", testRoute);
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/posts", postsRoute);
app.use("/api/support", supportRoute);
app.use("/api/admin", adminRoute);

// Database
const Database = require("./db/Database");
Database.authenticate()
  .then(() => console.log("Database connection established."))
  .catch(err => console.error("Connection refused. Error: ", err));

// FIXME: => Enable only when needed
Database.sync({
  logging: process.env.NODE_ENV === "development" ? true : false
});

// Server Init
const server = require("http").Server(app);

// Socket.io
const io = require("socket.io")(server);

// Sockets
io.on("connection", socketHandler);

// Server Start
app.listen(config.SERVER_PORT, () =>
  console.log(`Server running on http://localhost:${config.SERVER_PORT}/`)
);
