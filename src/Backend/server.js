const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const CustomError = require("./utils/customError");
const globalError = require("./middlewares/errorMiddleware");

dotenv.config({ path: "config.env" });
const dbConnection = require("./config/database");

const userRoute = require("./routes/userRoute");
const googleAuthRouter = require("./routes/googleAuthRoute");
const authRoute = require("./routes/authRoute");
// const articleRoute = require("./routes/articleRouter");

dbConnection();
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") app.use(logger("dev"));

app.use(googleAuthRouter);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
// app.use("/api/v1/articles", articleRoute);

app.use("/", (req, res, next) => {
  res.send("Hello World!");
});

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on this server`,
    404
  );
  next(err);
});

app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(
    `unhandeledRejection => name: ${err.name} | message: ${err.message}`
  );
  server.close(() => {
    console.log("Shutting down server due to unhandled promise rejection");
    process.exit(1);
  });
});
