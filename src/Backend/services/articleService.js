const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const factory = require("./handlersFactory");
const ArticleModel = require("../models/articleModel");
const { calculateReadingTime } = require("../utils/readingTime");
const { calculateFleschScoreFromHTML } = require("../utils/fleschScore");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploadArticleImage = uploadMixOfImages([
  {
    name: "cover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 15,
  },
]);

exports.resizeArticleImages = asyncHandler(async (req, res, next) => {
  // Image processing for image cover
  if (req.files.cover) {
    const imageCoverFileName = `article-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.cover[0].buffer)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`uploads/articles/${imageCoverFileName}`);
    // save image name into DB
    req.body.cover = imageCoverFileName;
  }
  // Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, i) => {
        const imageFileName = `article-${
          img.fileName
        }-${uuidv4()}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(img.buffer)
          .toFormat("jpeg")
          .jpeg({ quality: 100 })
          .toFile(`uploads/articles/${imageFileName}`);
        // save image name into DB
        req.body.images.push(imageFileName);
      })
    );
  }
  next();
});

exports.calculateReadingTime = asyncHandler(async (req, res, next) => {
  const readingTime = calculateReadingTime(req.body.content);
  req.body.readingTime = readingTime;
  next();
});

exports.calculateFleschScore = asyncHandler(async (req, res, next) => {
  const fleschScore = calculateFleschScoreFromHTML(req.body.content);
  req.body.fleschScore = fleschScore;
  next();
});

// @desc    Create new article
// @route   POST /api/v1/articles
// @access  private
exports.createArticle = factory.CreateOne(ArticleModel);

// @desc    Get all articles
// @route   GET /api/v1/articles?page=1&limit=10
// @access  public
const searchFieldsNames = ["title", "author", "category", "tags"];
exports.getArticles = factory.GetAll(ArticleModel, searchFieldsNames);

// @desc  Delete article by id
// @route DELETE api/v1/articles/:id
// @access private
exports.deleteArticleById = factory.DeleteOne(ArticleModel);

exports.increaseArticleViews = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const article = await ArticleModel.findById(id);
  article.views += 1;
  await article.save();
});

exports.getArticleById = factory.GetOne(ArticleModel);

// @desc    Update new article
// @route   POST /api/v1/articles
// @access  private
exports.updateArticle = factory.UpdateOne(ArticleModel);
