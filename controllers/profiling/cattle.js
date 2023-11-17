const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../../middleware/asyncWrapper");
const Cattle = require("../../models/Cattle");
const cloudinary = require("../../utils/cloudinary");

const register = asyncWrapper(async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.image);
  const cattle = await Cattle.create({ ...req.body, image: result.secure_url });
  res.status(StatusCodes.CREATED).json({
    message: "New Cattle Profile Added.",
    cattle: cattle,
  });
});

module.exports = register;
