// Article.js

const mongoose = require("mongoose");

// Define the schema for the article
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Backend",
        "Frontend",
        "Cloud",
        "Database",
        "DevOps",
        "Soft Skills",
        "Other",
      ],
      default: "Other",
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    fleschScore: {
      type: Number,
      default: 0,
    },
    cover: String,
    comments: [
      {
        text: String,
        postedBy: String,
        postedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create a model from the schema
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
