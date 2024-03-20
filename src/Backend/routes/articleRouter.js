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
} = require("../services/articleService");

const router = express.Router();

router
  .route("/")
  .get(authService.allowTo("admin", "manager"), getArticles)
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
  // .get(authService.allowTo("admin"), getOrDeleteArticleByIdValidator, getUserById)
  .put(
    authService.allowTo("admin"),
    updateArticleValidator,
    uploadArticleImage,
    resizeArticleImages,
    calculateReadingTime,
    calculateFleschScore,
    createArticle // TODO don't forget to change this route
  )
  .delete(
    authService.allowTo("admin"),
    getOrDeleteArticleByIdValidator,
    deleteArticleById
  );
