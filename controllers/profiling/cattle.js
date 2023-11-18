const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../../middleware/asyncWrapper");
const Cattle = require("../../models/Cattle");
const cloudinary = require("../../utils/cloudinary");
const fs = require("fs");
const moment = require("moment");

const register = asyncWrapper(async (req, res) => {
  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Upload Image.",
    });
  }
  const { vaccinationDate, dateOfTreatment } = req.body;
  const { path } = req.file;
  const parsedVaccineDate = moment(vaccinationDate, "DD-MM-YYYY");
  const parsedDateOfTreatment = moment(dateOfTreatment, "DD-MM-YYYY");
  if (!parsedVaccineDate.isValid() || !parsedDateOfTreatment.isValid()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid Date Format.",
    });
  }
  let result;
  try {
    result = await cloudinary.uploader.upload(path);
    const cattle = await Cattle.create({
      ...req.body,
      image: result.secure_url,
      vaccinationDate: parsedVaccineDate,
      dateOfTreatment: parsedDateOfTreatment,
    });
    res.status(StatusCodes.CREATED).json({
      message: "New Cattle Profile Added.",
      cattle: cattle,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
    if (result) {
      await cloudinary.uploader.destroy(result.public_id);
    }
  }
});

module.exports = register;
