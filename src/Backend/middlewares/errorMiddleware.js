const CustomError = require("../utils/customError");

const errorForDev = (err, res) =>
  res.status(500).json({
    message: err.message,
    error: err,
    status: err.status,
    stack: err.stack,
  });

const errorForProd = (err, res) =>
  res.status(500).json({
    message: err.message,
    status: err.status,
  });

const handleJWTInvalidSignature = () =>
  new CustomError("Invalid token, Please login again...", 401);
const handleJWTTokenExpired = () =>
  new CustomError("Expired token, Please login again...", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") errorForDev(err, res);
  else {
    if (err.name === "JsonWebTokenError") err = handleJWTInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJWTTokenExpired();
    errorForProd(err, res);
  }
};

module.exports = globalError;
