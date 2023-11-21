const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../../middleware/asyncWrapper");
const Cattle = require("../../models/Cattle");
const cloudinary = require("../../utils/cloudinary");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const register = asyncWrapper(async (req, res) => {
  let result;
  try {
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
    result = await cloudinary.uploader.upload(path);
    const cattle = await Cattle.create({
      ...req.body,
      image: result.secure_url,
      vaccinationDate: parsedVaccineDate,
      dateOfTreatment: parsedDateOfTreatment,
    });
    const token = jwt.sign({ cattleId: cattle.Id });
    res.status(StatusCodes.CREATED).json({
      message: "New Cattle Profile Added.",
      cattle: cattle,
      token: token,
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

// Get All Cattle
const allCattle = asyncWrapper(async (req, res) => {
  const cattle = await Cattle.find();
  res.status(StatusCodes.OK).json({
    message: {
      allCattle: cattle,
    },
  });
});

// Get A Specific Cattle
const getCattle = asyncWrapper(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(StatusCodes.OK).json({
      message: "Please Provide Token.",
    });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { cattleId } = decodedToken;
  const cattle = await Cattle.find({ Id: cattleId });
  res.status(StatusCodes.OK).json({
    message: {
      cattle: cattle,
    },
  });
});

module.exports = { register, allCattle, getCattle };
