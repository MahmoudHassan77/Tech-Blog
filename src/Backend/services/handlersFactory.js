const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const ApiFeatures = require("../utils/apiFeatures");
const StatusCodes = require("../utils/statusCodes");

exports.DeleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const item = await Model.findByIdAndDelete(id);
    if (!item)
      return next(new CustomError(`Item with id: ${id} is not found`, 400));

    res.status(StatusCodes.Success).json({ status: "success" });
  });

exports.UpdateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const item = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
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

exports.GetOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const item = await Model.findById(id);
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

exports.CreateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(StatusCodes.Success).json({ status: "success", data: { item } });
  });

exports.GetAll = (Model, searchFieldsNames) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;
    const apiFeature = new ApiFeatures(Model.find(filter), req.query);
    const documentCount = await Model.countDocuments();
    apiFeature
      .paginate(documentCount)
      .filter()
      .sort()
      .search(searchFieldsNames)
      .limitFields();
    const { mongooseQuery, paginationResult } = apiFeature;
    const items = await mongooseQuery;

    res.status(StatusCodes.Success).json({
      status: "success",
      paginationResult,
      count: items.length,
      data: { items },
    });
  });
