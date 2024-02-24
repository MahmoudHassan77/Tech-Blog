const jwt = require("jsonwebtoken");
const bycrpt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const CustomError = require("../utils/customError");
const UserModel = require("../models/userModel");
const StatusCodes = require("../utils/statusCodes");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// @desc    Signup
// @route   POST /api/v1/auth/signup
// @access  public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create the user
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordChangedAt: Date.now(),
  });
  // 2- Generate the token
  const token = generateToken({ userId: user._id });
  res.status(StatusCodes.Success).json({ data: user, token });
});

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  public
exports.login = asyncHandler(async (req, res, next) => {
  // 1- Find the user
  const user = await UserModel.findOne({ email: req.body.email });
  // 2- Verify the user
  if (!user || !(await bycrpt.compare(req.body.password, user.password)))
    return next(new CustomError("Email or password is incorrect!"));
  const token = generateToken({ userId: user._id });
  res.status(StatusCodes.Success).json({ data: user, token });
});

// @desc make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1- Check if token exist, if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  if (!token)
    return next(
      new CustomError(
        "You aren't login, Please login to get access this route.",
        StatusCodes.Forbidden
      )
    );
  // 2- Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3- Check if user exist
  const currentUser = await UserModel.findById(decoded.userId);
  if (!currentUser)
    return next(
      new CustomError(
        "The user that belongs to this token does no longer exist.",
        StatusCodes.Forbidden
      )
    );
  // 4- Check if user change his password after token created
  const passChangedTimeStamp = parseInt(
    currentUser.passwordChangedAt.getTime() / 1000,
    10
  );
  if (passChangedTimeStamp > decoded.iat) {
    return next(
      new CustomError(
        "User recently changed his password. Please login again..",
        StatusCodes.Forbidden
      )
    );
  }
  req.user = currentUser;
  next();
});

exports.allowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    const isAuthorized = roles.includes(req.user.role);
    if (!isAuthorized)
      return next(
        new CustomError("User is not authorized!", StatusCodes.UnAuthorized)
      );
    next();
  });

// @desc    Forget Password
// @route   POST /api/v1/auth/forgetPassword
// @access  public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1- Find user by email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user)
    return next(
      new CustomError(
        `There is no user with that email: ${req.body.email}`,
        StatusCodes.NotFound
      )
    );
  // 2- If user is exist, send hash random reset code of 6 digits with expire date and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();
  // 3- Send reset code via email
  try {
    await sendEmail({
      to: user.email,
      subject: "Your Password Reset Code (valid for 10 min)",
      message: `Hi ${user.name}, \n We received a request to reset the password on your account. \n\n Reset Code: ${resetCode} \n Enter this reset code to complete the reset.`,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();
    throw new CustomError(
      "There is an error in sending email",
      StatusCodes.Failed
    );
  }
  res
    .status(StatusCodes.Success)
    .json({ status: "success", message: "Reset code sent to email" });
});

// @desc    Verify Reset Code
// @route   POST /api/v1/auth/verifyResetCode
// @access  public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedPass = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await UserModel.findOne({
    passwordResetCode: hashedPass,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) return next(new CustomError("Reset code invalid or expired"));
  user.passwordResetVerified = true;
  await user.save();
  res.status(StatusCodes.Success).json({ status: "success" });
});

// @desc    Reset Password
// @route   POST /api/v1/auth/resetPassword
// @access  public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user)
    return next(
      new CustomError(
        `There is no user with that email: ${req.body.email}`,
        StatusCodes.NotFound
      )
    );
  if (!user.passwordResetVerified)
    return next(
      new CustomError(`Reset code not verifed.`, StatusCodes.BadRequest)
    );
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  const token = generateToken({ userId: user._id });
  res.status(StatusCodes.Success).json({ token });
});
