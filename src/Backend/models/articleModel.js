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

articleSchema.pre(["find", "findOne"], function (next) {
  this.populate("comments.postedBy", "name");
  this.populate("comments.replies.postedBy", "name");
  next();
});

const setImageUrl = (doc) => {
  // return image baseURL + image name
  if (doc.cover) {
    const imageUrl = `${process.env.BASE_URL}/articles/${doc.cover}`;
    doc.cover = imageUrl;
  }
  if (doc.images) {
    const images = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/articles/${image}`;
      images.push(imageUrl);
      const imgOldName = image.split("-")[1];
      doc.content.replace(imgOldName, imageUrl);
    });
    doc.images = images;
  }
};

articleSchema.post("init", (doc) => {
  setImageUrl(doc);
});

articleSchema.post("save", (doc) => {
  setImageUrl(doc);
});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
