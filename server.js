const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const conn = require("./config/db");
const errorHandler = require("./middleware/error");
const auth = require("./Routes/auth");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const path = require("path");

//Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

//Connect to db
conn();

//body parser
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Cookie parser
app.use(cookieParser());

//sanitize routes
app.use(mongoSanitize());

//set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(hpp());

app.use(cors());

app.use("/api/v1/auth", auth);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
app.use("/", (req, res) => {
  var options = {
    root: path.join(__dirname),
  };
  res.sendFile("index.html", options, (err) => {
    if (err) console.log(err);
  });
});
app.get("/", function (req, res) {
  console.log("File Sent");
  res.send();
});
app.use(errorHandler);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err}`);
  server.close(() => process.exit(1));
});