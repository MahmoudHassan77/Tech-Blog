const multer = require("multer");
const CustomError = require("../utils/customError");

const multerOptions = () => {
  // Disk Storage
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     const ext = file.mimetype.split("/")[1];
  //     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, fileName);
  //   },
  // });
  // Memory Storage ==> output(Buffer)
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
