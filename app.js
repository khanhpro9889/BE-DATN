// Config env
require('dotenv').config()

const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const mongoClient = require("mongoose");

// setup connect mongodb by mongoose
mongoClient
  .connect("mongodb://localhost:27017/doan", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected database from mongodb."))
  .catch((error) =>
    console.error(`❌ Connect database is failed with error which is ${error}`)
  );

const app = express();

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const uploadRoute = require('./routes/uploads-text-editor');
const districtRoute = require('./routes/district');
const provinceRoute = require('./routes/province');
const postRoute = require('.//routes/gym');
const categoryRoute = require('./routes/category');
const utilityRoute = require('./routes/utility');
const saveRoute = require('./routes/save');

// Start the server
const port = app.get("port") || 3001;
const server = app.listen(port, () => console.log(`Server is listening on port ${port}`));
const io = require('socket.io').listen(server);
app.disable('etag');
app.use(function(req, res, next) {
  req.io = io;
  next();
});

// Middlewares
app.use(logger("dev"));
app.use(bodyParser.json());

app.use("/uploads", express.static('uploads'))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,PATCH,POST,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

// Routes
//app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/conversations", conversationRoute);
app.use("/messages", messageRoute);
app.use("/upload-text-editor", uploadRoute);
app.use("/districts", districtRoute);
app.use("/provinces", provinceRoute);
app.use("/gym", postRoute);
app.use("/category", categoryRoute);
app.use("/utility", utilityRoute);
app.use("/saves", saveRoute);

// Routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Server is OK!",
  });
});

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});



