const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../../middleware/asyncWrapper");
const Cattle = require("../../models/Cattle");
const cloudinary = require("../../utils/cloudinary");
const moment = require("moment");

// Function to create consistent response data
const createResponseData = (payload, hasErrors, message) => {
  return {
    payload,
    hasErrors,
    message,
  };
};

// Register Cattle
const registerCattle = asyncWrapper(async (req, res) => {
  let result;
  const { id, name } = req.currentUser;
  try {
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createResponseData(null, true, "Please Upload Image."));
    }
    // const { vaccinationDate, dateOfTreatment } = req.body;
    const { path } = req.file;
    // const parsedVaccineDate = moment(vaccinationDate, "DD-MM-YYYY");
    // const parsedDateOfTreatment = moment(dateOfTreatment, "DD-MM-YYYY");
    // if (!parsedVaccineDate.isValid() || !parsedDateOfTreatment.isValid()) {
    //   return res
    //     .status(StatusCodes.BAD_REQUEST)
    //     .json(createResponseData(null, true, "Invalid Date Format."));
    // }
    result = await cloudinary.uploader.upload(path);
    const cattle = await Cattle.create({
      ...req.body,
      registeredBy: id,
      image: result.secure_url,
    });
    // const { _id, ...cattleData } = cattle.toJSON();
    res.status(StatusCodes.CREATED).json(
      createResponseData(
        {
          cattle: cattle,
          registrarName: name,
        },
        false,
        "New Cattle Profile Added."
      )
    );
  } catch (err) {
    if (result) {
      await cloudinary.uploader.destroy(result.public_id);
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponseData(null, true, err.message));
  }
});

// Get All Cattle
const allCattle = asyncWrapper(async (req, res) => {
  const cattle = await Cattle.find();
  if (cattle.length === 0) {
    res
      .status(StatusCodes.OK)
      .json(createResponseData(null, false, "No Cattle is Found in Database."));
  } else {
    res.status(StatusCodes.OK).json(
      createResponseData(
        {
          allCattle: cattle.map((items) => {
            return items;
          }),
        },
        false,
        "All Cattle Found in Database."
      )
    );
  }
});

// Get A Specific Cattle
const getCattle = asyncWrapper(async (req, res) => {
  const { cattleId } = req.params;
  if (!cattleId.startsWith("NGN")) {
    return res
      .starts(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid CattleId"));
  }
  if (!cattleId) {
    return res
      .status(StatusCodes.OK)
      .json(createResponseData(null, true, "Please Provide Cattle Id."));
  }
  const cattle = await Cattle.findOne({ Id: cattleId });
  if (!cattle) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid Cattle Id"));
  }
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        cattle: cattle,
      },
      false,
      "Specific Cattle Found."
    )
  );
});

// Get Cattle Created By a Specific User
const allUserCattle = asyncWrapper(async (req, res) => {
  const { id } = req.currentUser;
  const allCattle = await Cattle.find({ registeredBy: id });
  if (!allCattle) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid User Id."));
  }
  if (allCattle.length === 0) {
    res
      .status(StatusCodes.OK)
      .json(
        createResponseData(
          null,
          false,
          "You haven't registered any cattle to database."
        )
      );
  } else {
    res.status(StatusCodes.OK).json(
      createResponseData(
        {
          allUserCattle: allCattle,
        },
        false,
        "All Cattle Registered by User Found."
      )
    );
  }
});

// Update Cattle
const updateCattle = asyncWrapper(async (req, res) => {
  const { cattleId } = req.params;
  const data = { ...req.body };

  // Filter out null values from the data
  const filteredData = {};
  Object.keys(data).forEach((key) => {
    if (data[key] !== null) {
      filteredData[key] = data[key];
    }
  });

  if (Object.keys(filteredData).length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createResponseData(null, true, "No valid data provided for update.")
      );
  }

  const updatedCattle = await Cattle.findOneAndUpdate(
    { cattleId: cattleId },
    { $set: filteredData },
    { new: true }
  );

  if (!updatedCattle) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(
        createResponseData(null, true, `Cattle with Id: ${cattleId} Not Found.`)
      );
  }

  res
    .status(StatusCodes.OK)
    .json(
      createResponseData(
        { updatedCattle: updatedCattle },
        false,
        "Cattle Updated Successfully."
      )
    );
});

// Delete a Specific Cattle
const deleteCattle = asyncWrapper(async (req, res) => {
  const { cattleId } = req.params;
  if (!cattleId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Cattle Id."));
  }
  const cattle = await Cattle.findOneAndDelete({ Id: cattleId });
  if (!cattle) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createResponseData(
          null,
          true,
          `Cattle with Id: ${cattleId} is not Found.`
        )
      );
  }
  res
    .status(StatusCodes.OK)
    .json(
      createResponseData(
        null,
        false,
        `Cattle with Id: ${cattleId} has been Deleted.`
      )
    );
});

// Verify a Cattle
const verifyCattle = asyncWrapper(async (req, res) => {
  const { cattleId } = req.params;
  if (!cattleId.startsWith("NGN")) {
    return res
      .starts(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid CattleId"));
  }
  if (!cattleId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please provide Cattle Id."));
  }
  const cattle = await Cattle.findOne({ cattleId: cattleId });
  if (!cattle) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createResponseData(
          null,
          true,
          `Cattle with Id: ${cattleId} is not Found.`
        )
      );
  }
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        animalId: cattle.cattleId,
        weight: cattle.weight,
        breed: cattle.breed,
        DOB: cattle.DOB,
        age: cattle.age,
        type: cattle.animalType,
        group: cattle.group.map((groups) => {
          return groups;
        }),
        gender: cattle.gender,
        color: cattle.color,
        health: cattle.health,
        source: cattle.source,
      },
      false,
      "Cattle Found."
    )
  );
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
