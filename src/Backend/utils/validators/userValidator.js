const { check, body } = require("express-validator");
const slugify = require("slugify");
const bycrpt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const UserModel = require("../../models/userModel");
const CustomError = require("../customError");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id."),
  validatorMiddleware,
];

exports.createUserValidator = [
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
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accept Egy and SA"),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("name")
    .optional()
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
    .optional()
    .notEmpty()
    .withMessage("User email is required.")
    .isEmail()
    .withMessage("Invalid email address.")
    .custom(async (val, { req }) => {
      const userToUpdate = await UserModel.findById(req.params.id);
      if (val !== userToUpdate.email) {
        const user = await UserModel.findOne({ email: val });
        if (user) throw new CustomError("Email already in use.");
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accept Egy and SA"),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid user id."),
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter you current password."),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm."),
  body("password")
    .notEmpty()
    .withMessage("You must enter new confirm.")
    .custom(async (val, { req }) => {
      // 1- verify current password
      const user = await UserModel.findById(req.params.id);
      if (!user) throw new CustomError("There is no user with this id");
      const isCorrect = await bycrpt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrect) throw new CustomError("Incorrect current password.");
      // 2- verify password confirm
      if (val !== req.body.passwordConfirm)
        throw new CustomError("Password confirmation is incorrect");
      return true;
    }),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id."),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name")
    .optional()
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
    .optional()
    .notEmpty()
    .withMessage("User email is required.")
    .isEmail()
    .withMessage("Invalid email address.")
    .custom(async (val, { req }) => {
      const userToUpdate = await UserModel.findById(req.params.id);
      if (val !== userToUpdate.email) {
        const user = await UserModel.findOne({ email: val });
        if (user) throw new CustomError("Email already in use.");
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accept Egy and SA"),
  check("profileImg").optional(),
  validatorMiddleware,
];
