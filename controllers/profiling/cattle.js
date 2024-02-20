const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../../middleware/asyncWrapper");
const Cattle = require("../../models/Cattle");
const cloudinary = require("../../utils/cloudinary");
const moment = require("moment");

// Register Cattle
const registerCattle = asyncWrapper(async (req, res) => {
  let result;
  const { id, name } = req.currentUser;
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
      registeredBy: id,
      image: result.secure_url,
      vaccinationDate: parsedVaccineDate,
      dateOfTreatment: parsedDateOfTreatment,
    });

    res.status(StatusCodes.CREATED).json({
      message: "New Cattle Profile Added.",
      cattle: cattle,
      registrarName: name,
    });
  } catch (err) {
    if (result) {
      await cloudinary.uploader.destroy(result.public_id);
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
});

// Get All Cattle
const allCattle = asyncWrapper(async (req, res) => {
  const cattle = await Cattle.find();
  cattle.length === 0
    ? res.status(StatusCodes.OK).json({
        message: "No Cattle is Found in Database.",
      })
    : res.status(StatusCodes.OK).json({
        message: {
          allCattle: cattle,
        },
      });
});

// Get A Specific Cattle
const getCattle = asyncWrapper(async (req, res) => {
  const { cattleId } = req.params;
  if (!cattleId) {
    return res.status(StatusCodes.OK).json({
      message: "Please Provide Cattle Id.",
    });
  }
  const cattle = await Cattle.findOne({ Id: cattleId });
  if (!cattle) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid Cattle Id",
    });
  }
  res.status(StatusCodes.OK).json({
    message: {
      cattle: cattle,
    },
  });
});

// Get Cattle Created By a Specific User
const allUserCattle = asyncWrapper(async (req, res) => {
  const { id } = req.currentUser;
  const allCattle = await Cattle.find({ registeredBy: id });
  if (!allCattle) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid User Id.",
    });
  }
  allCattle.length === 0
    ? res.status(StatusCodes.OK).json({
        message: "You haven't registered any cattle to database.",
      })
    : res.status(StatusCodes.OK).json({
        message: allCattle,
      });
});

// Update Cattle
const updateCattle = asyncWrapper(async (req, res) => {
  const { cattleId } = req.params;
  const data = { ...req.body };
  if (Object.keys(data).length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide Data.",
    });
  }
  if (data.vaccinationDate) {
    data.vaccinationDate = moment(data.vaccinationDate, "DD-MM-YYYY").isValid()
      ? moment(data.vaccinationDate, "DD-MM-YYYY").toDate()
      : undefined;
  }
  if (data.dateOfTreatment) {
    data.dateOfTreatment = moment(data.dateOfTreatment, "DD-MM-YYYY").isValid()
      ? moment(data.dateOfTreatment, "DD-MM-YYYY").toDate()
      : undefined;
  }
  const updatedCattle = await Cattle.findOneAndUpdate(
    { Id: cattleId },
    {
      $push: {
        vaccinationDate: data.vaccinationDate,
        dateOfTreatment: data.dateOfTreatment,
      },
      $set: {
        ...data,
        vaccinationDate: undefined,
        dateOfTreatment: undefined,
      },
    },
    { new: true }
  );
  if (!updatedCattle) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `Cattle with Id: ${cattleId} Not Found.`,
    });
  }
  res.status(StatusCodes.OK).json({
    message: updatedCattle,
  });
});

//  Delete a Specific Cattle
const deleteCattle = asyncWrapper(async (req, res) => {
  const { cattleId } = req.params;
  if (!cattleId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `Please Provide Cattle Id.`,
    });
  }
  const cattle = await Cattle.findOneAndDelete({ Id: cattleId });
  if (!cattle) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `Cattle with Id: ${cattleId} is not Found.`,
    });
  }
  res.status(StatusCodes.OK).json({
    message: `Cattle with Id: ${cattleId} has been Deleted.`,
  });
});

const verifyCattle = asyncWrapper(async (req, res) => {
  const { cattleId } = req.params;
  if (!cattleId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `Please provide Cattle Id.`,
    });
  }
  const cattle = await Cattle.findOne({ Id: id });
  if (!cattle) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `Cattle with Id: ${cattleId} is not Found.`,
    });
  }
  res.status(StatusCodes.OK).json({
    message: cattle,
  });
});

module.exports = {
  registerCattle,
  allCattle,
  getCattle,
  allUserCattle,
  updateCattle,
  deleteCattle,
  verifyCattle,
};
