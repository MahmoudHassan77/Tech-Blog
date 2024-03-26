const express = require("express");
const authService = require("../services/authService");
const {
  createArticleValidator,
  getOrDeleteArticleByIdValidator,
  updateArticleValidator,
} = require("../utils/validators/articleValidator");
const {
  getArticles,
  uploadArticleImage,
  resizeArticleImages,
  calculateReadingTime,
  createArticle,
  calculateFleschScore,
  deleteArticleById,
  getArticleById,
  increaseArticleViews,
  updateArticle,
} = require("../services/articleService");

const router = express.Router();

router
  .route("/")
  .get(getArticles)
  .post(
    authService.allowTo("admin"),
    createArticleValidator,
    uploadArticleImage,
    resizeArticleImages,
    calculateReadingTime,
    calculateFleschScore,
    createArticle
  );

router
  .route("/:id")
  .get(getOrDeleteArticleByIdValidator, increaseArticleViews, getArticleById)
  .put(
    authService.allowTo("admin"),
    updateArticleValidator,
    uploadArticleImage,
    resizeArticleImages,
    calculateReadingTime,
    calculateFleschScore,
    updateArticle
  )
  .delete(
    authService.allowTo("admin"),
    getOrDeleteArticleByIdValidator,
    deleteArticleById
  );

module.exports = router;
