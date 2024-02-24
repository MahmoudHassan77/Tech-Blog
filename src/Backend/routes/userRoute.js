const express = require("express");
const {
  getUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  changeLoggedUserPassword,
  changeLoggedUserData,
} = require("../services/userService");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");
const authService = require("../services/authService");

const router = express.Router();

// In case we need to apply pipeline on all routers
router.use(authService.protect);

router.get("/getMe", authService.protect, getLoggedUserData, getUserById);
router.put("/changeMyPassword", authService.protect, changeLoggedUserPassword);
router.put(
  "/changeMyData",
  authService.protect,
  updateLoggedUserValidator,
  changeLoggedUserData
);

router.put(
  "/changePassword/:id",
  authService.allowTo("admin", "manager"),
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(authService.allowTo("admin", "manager"), getUsers)
  .post(
    authService.allowTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(authService.allowTo("admin"), getUserValidator, getUserById)
  .put(
    authService.allowTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUserById
  )
  .delete(authService.allowTo("admin"), deleteUserValidator, deleteUserById);

module.exports = router;
