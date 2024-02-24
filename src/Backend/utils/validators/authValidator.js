const { check, body } = require("express-validator");
const slugify = require("slugify");
const bycrpt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const UserModel = require("../../models/userModel");
const CustomError = require("../customError");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required.")
    .isLength({ min: 3 })
    .withMessage("User name is too short.")
    .isLength({ max: 32 })
    .withMessage("User name is too long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("User email is required.")
    .isEmail()
    .withMessage("Invalid email address.")
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user)
          return Promise.reject(new CustomError("Email already in use."));
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("User password is required.")
    .isLength({ min: 6 })
    .withMessage("User password must be at least 6 characters.")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm)
        throw new CustomError("Password confirmation is incorrect");
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("User password confirmation is required."),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("User email is required.")
    .isEmail()
    .withMessage("Invalid email address."),
  check("password").notEmpty().withMessage("User password is required."),
  validatorMiddleware,
];
