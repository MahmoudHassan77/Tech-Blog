const mongoose = require("mongoose");

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
      type: mongoose.Schema.ObjectId,
      ref: "User",
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
    images: {
      type: Array,
    },
    comments: [
      {
        text: String,
        postedBy: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        postedAt: {
          type: Date,
          default: Date.now,
        },
        replies: [
          {
            text: String,
            postedBy: {
              type: mongoose.Schema.ObjectId,
              ref: "User",
              required: true,
            },
            postedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
