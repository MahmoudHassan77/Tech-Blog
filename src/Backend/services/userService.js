const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
//const sharp = require("sharp");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const UserModel = require("../models/userModel");
const CustomError = require("../utils/customError");
const generateToken = require("../utils/generateToken");
const StatusCodes = require("../utils/statusCodes");

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  // await sharp(req.file.buffer)
  //   .resize(600, 600)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(`uploads/users/${fileName}`);
  // save image name into DB
  req.body.profileImg = fileName;
  next();
});

// @desc    Get all users
// @route   GET /api/v1/users?page=1&limit=10
// @access  private
const searchFieldsNames = ["name"];
exports.getUsers = factory.GetAll(UserModel, searchFieldsNames);

// @desc    Create new user
// @route   POST /api/v1/users
// @access  private
exports.createUser = factory.CreateOne(UserModel);

// @desc    Get user by id
// @route   GET /api/v1/users/:id
// @access  private
exports.getUserById = factory.GetOne(UserModel);

// @desc    Update user by id
// @route   PUT /api/v1/users/:id
// @access  private
exports.updateUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const item = await UserModel.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!item) {
    return next(new CustomError(`Item with id: ${id} is not found`, 400));
  }
  res.status(StatusCodes.Success).json({
    status: "success",
    data: {
      item,
    },
  });
});

// @desc  Update user password
// @route POST api/v1/users/:id
// @access private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return next(
      new CustomError(
        `Item with id: ${id} is not found`,
        StatusCodes.BadRequest
      )
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// @desc  Delete user by id
// @route DELETE api/v1/users/:id
// @access private
exports.deleteUserById = factory.DeleteOne(UserModel);

// @desc  Get user logged data
// @route DELETE api/v1/users/getMe
// @access private/protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc  Change Logged User Password
// @route DELETE api/v1/users/changeMyPassword
// @access private/protect
exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );
  console.log("user", user);
  const token = generateToken({ userId: user._id });
  res.status(StatusCodes.Success).json({ data: user, token });
});

// @desc  Change Logged User Data (without password or role)
// @route DELETE api/v1/users/changeMyData
// @access private/protect
exports.changeLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(StatusCodes.Success).json({
    status: "success",
    data: {
      user,
    },
  });
});
