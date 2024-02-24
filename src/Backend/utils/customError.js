// @desc: Custom Error class to handle errors in the application
// @params: message, statusCode
// @return: Error Object
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
  }
}

module.exports = CustomError;
