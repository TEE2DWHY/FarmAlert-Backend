const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../../middleware/asyncWrapper");
const Dog = require("../../models/Dog");
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

// Register Dog
const registerDog = asyncWrapper(async (req, res) => {
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
    const dog = await Dog.create({
      ...req.body,
      registeredBy: id,
      dogImage: result.secure_url,
    });
    res.status(StatusCodes.CREATED).json(
      createResponseData(
        {
          dog: dog,
          registrarName: name,
        },
        false,
        "New Dog Profile Added."
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

// Get All Dog
const allDog = asyncWrapper(async (req, res) => {
  const dog = await Dog.find();
  if (dog.length === 0) {
    res
      .status(StatusCodes.OK)
      .json(createResponseData(null, false, "No Dog is Found in Database."));
  } else {
    res.status(StatusCodes.OK).json(
      createResponseData(
        {
          allDog: dog.map((items) => {
            return items;
          }),
        },
        false,
        "All Dog Found in Database."
      )
    );
  }
});

// Get A Specific Dog
const getDog = asyncWrapper(async (req, res) => {
  const { dogId } = req.params;
  if (!dogId.startsWith("NGN")) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid dogId"));
  }
  if (!dogId) {
    return res
      .status(StatusCodes.OK)
      .json(createResponseData(null, true, "Please Provide Dog Id."));
  }
  const dog = await Dog.findOne({ dogId: dogId });
  if (!dog) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid Dog Id"));
  }
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        dog: dog,
      },
      false,
      "Specific Dog Found."
    )
  );
});

// Get Dog Created By a Specific User
const allUserDog = asyncWrapper(async (req, res) => {
  const { id } = req.currentUser;
  const allDog = await Dog.find({ registeredBy: id });
  if (!allDog) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid User Id."));
  }
  if (allDog.length === 0) {
    res
      .status(StatusCodes.OK)
      .json(
        createResponseData(
          null,
          false,
          "You haven't registered any dog to database."
        )
      );
  } else {
    res.status(StatusCodes.OK).json(
      createResponseData(
        {
          allUserDog: allDog,
        },
        false,
        "All Dog Registered by User Found."
      )
    );
  }
});

// Update Dog
const updateDog = asyncWrapper(async (req, res) => {
  const { dogId } = req.params;
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

  const updatedDog = await Dog.findOneAndUpdate(
    { dogId: dogId },
    { $set: filteredData },
    { new: true }
  );

  if (!updatedDog) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createResponseData(null, true, `Dog with Id: ${dogId} Not Found.`));
  }

  res
    .status(StatusCodes.OK)
    .json(
      createResponseData(
        { updatedDog: updatedDog },
        false,
        "Dog Updated Successfully."
      )
    );
});

// Delete a Specific Dog
const deleteDog = asyncWrapper(async (req, res) => {
  const { dogId } = req.params;
  if (!dogId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Dog Id."));
  }
  const dog = await Dog.findOneAndDelete({ Id: dogId });
  if (!dog) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createResponseData(null, true, `Dog with Id: ${dogId} is not Found.`)
      );
  }
  res
    .status(StatusCodes.OK)
    .json(
      createResponseData(null, false, `Dog with Id: ${dogId} has been Deleted.`)
    );
});

// Verify a Dog
const verifyDog = asyncWrapper(async (req, res) => {
  const { dogId } = req.params;
  if (!dogId.startsWith("NGN")) {
    return res
      .starts(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid DogId"));
  }
  if (!dogId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please provide Dog Id."));
  }
  const dog = await Dog.findOne({ dogId: dogId });
  if (!dog) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createResponseData(null, true, `Dog with Id: ${dogId} is not Found.`)
      );
  }
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        dog,
      },
      false,
      "Dog Found."
    )
  );
});

module.exports = {
  registerDog,
  allDog,
  getDog,
  allUserDog,
  updateDog,
  deleteDog,
  verifyDog,
};
