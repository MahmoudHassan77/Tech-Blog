const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const UserModel = require("../../models/userModel");
const CustomError = require("../customError");

exports.getOrDeleteArticleByIdValidator = [
  check("id").isMongoId().withMessage("Article id must be a valid mongodb id"),
  validatorMiddleware,
];

exports.createArticleValidator = [
  check("title").notEmpty().withMessage("Title is required."),
  check("content").notEmpty().withMessage("Content is required."),
  check("author")
    .notEmpty()
    .withMessage("Author is required.")
    .isMongoId()
    .withMessage("Invalid author id.")
    .custom((userId) =>
      UserModel.findById(userId).then((user) => {
        if (!user) {
          return Promise.reject(new CustomError("Author does not exist."));
        }
        return true;
      })
    ),
  check("category")
    .notEmpty()
    .withMessage("Category is required.")
    .isIn([
      "Backend",
      "Frontend",
      "Cloud",
      "Database",
      "DevOps",
      "Soft Skills",
      "Other",
    ])
    .withMessage("Invalid category."),
  check("tags").optional().isArray().withMessage("Tags must be an array."),
  check("views")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Views must be a non-negative integer."),
  check("likes")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Likes must be a non-negative integer."),
  check("readingTime")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Reading time must be a non-negative integer."),
  check("fleschScore")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Flesch score must be a non-negative number."),
  check("cover").notEmpty().withMessage("Article cover image is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Article images must be an array"),
  check("comments")
    .optional()
    .isArray()
    .withMessage("Comments must ba an array"),
  check("comments.*.replies")
    .optional()
    .isArray()
    .withMessage("Comments must ba an array"),
  check("comments.*.postedBy")
    .notEmpty()
    .withMessage("Comment must be posted by a user.")
    .isMongoId()
    .withMessage("Invalid user ID for comment.")
    .custom((userId) =>
      UserModel.findById(userId).then((user) => {
        if (!user) {
          return Promise.reject(new CustomError("Author does not exist."));
        }
        return true;
      })
    ),
  check("comments.*.replies.*.postedBy")
    .notEmpty()
    .withMessage("Reply must be posted by a user.")
    .isMongoId()
    .withMessage("Invalid user ID for reply.")
    .custom((userId) =>
      UserModel.findById(userId).then((user) => {
        if (!user) {
          return Promise.reject(new CustomError("Author does not exist."));
        }
        return true;
      })
    ),
  validatorMiddleware,
];

exports.updateArticleValidator = [
  check("title").optional().notEmpty().withMessage("Title is required."),
  check("content").optional().notEmpty().withMessage("Content is required."),
  check("author")
    .notEmpty()
    .withMessage("Author is required.")
    .isMongoId()
    .withMessage("Invalid author id.")
    .custom((userId) =>
      UserModel.findById(userId).then((user) => {
        if (!user) {
          return Promise.reject(new CustomError("Author does not exist."));
        }
        return true;
      })
    ),
  check("category")
    .optional()
    .notEmpty()
    .withMessage("Category is required.")
    .isIn([
      "Backend",
      "Frontend",
      "Cloud",
      "Database",
      "DevOps",
      "Soft Skills",
      "Other",
    ])
    .withMessage("Invalid category."),
  check("tags").optional().isArray().withMessage("Tags must be an array."),
  check("cover")
    .optional()
    .notEmpty()
    .withMessage("Article cover image is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Article images must be an array"),
  check("comments")
    .optional()
    .isArray()
    .withMessage("Comments must ba an array"),
  check("comments.*.replies")
    .optional()
    .isArray()
    .withMessage("Comments must ba an array"),
  check("comments.*.postedBy")
    .notEmpty()
    .withMessage("Comment must be posted by a user.")
    .isMongoId()
    .withMessage("Invalid user ID for comment.")
    .custom((userId) =>
      UserModel.findById(userId).then((user) => {
        if (!user) {
          return Promise.reject(new CustomError("Author does not exist."));
        }
        return true;
      })
    ),
  check("comments.*.replies.*.postedBy")
    .notEmpty()
    .withMessage("Reply must be posted by a user.")
    .isMongoId()
    .withMessage("Invalid user ID for reply.")
    .custom((userId) =>
      UserModel.findById(userId).then((user) => {
        if (!user) {
          return Promise.reject(new CustomError("Author does not exist."));
        }
        return true;
      })
    ),
  validatorMiddleware,
];
