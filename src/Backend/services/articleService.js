const factory = require("./handlersFactory");
const ArticleModel = require("../models/articleModel");
const CustomError = require("../utils/customError");

// @desc  Delete article by id
// @route DELETE api/v1/articles/:id
// @access private
exports.deleteUserById = factory.DeleteOne(ArticleModel);
