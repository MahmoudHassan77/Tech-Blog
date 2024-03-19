const multer = require("multer");
const CustomError = require("../utils/customError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new CustomError("Only images allowed.", 400));
    }
  };

  return multer({ storage: multerStorage, fileFilter: multerFilter });
};

exports.uploadSingleImage = (fileldName) => multerOptions().single(fileldName);
exports.uploadMixOfImages = (fields) => multerOptions().fields(fields);
