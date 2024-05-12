const asyncWrapper = require("../../middleware/asyncWrapper");
const Sales = require("../../models/Sales");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("../../utils/cloudinary");
const Dog = require("../../models/Dog");

// Function to create consistent response data
const createResponseData = (payload, hasErrors, message) => {
  return {
    payload,
    hasErrors,
    message,
  };
};

// Register Sales
const registerSales = asyncWrapper(async (req, res) => {
  try {
    const { id, name } = req.currentUser;
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createResponseData(null, true, "Please Upload Image."));
    }
    const { path } = req.file;
    result = await cloudinary.uploader.upload(path);
    const newRecord = await Sales.create({
      ...req.body,
      image: result.secure_url,
      createdBy: {
        _id: id,
      },
    });
    res.status(StatusCodes.CREATED).json(
      createResponseData(
        {
          newRecord: newRecord,
          registrarName: {
            fullName: name,
          },
        },
        false,
        "Sales Record Created Successfully."
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

// Get Sales
const getAllSales = asyncWrapper(async (req, res) => {
  const sales = await Sales.find();
  if (sales.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json(
        createResponseData(null, false, "No Sales Record has been Uploaded.")
      );
  }
  const dogIds = sales.map((sale) => sale.dogId);
  const dogs = await Dog.find({ dogId: { $in: dogIds } });

  const salesWithDogs = sales.map((sale) => {
    const matchingDog = dogs.find((d) => d.dogId === sale.dogId);
    return {
      ...sale._doc,
      weight: matchingDog ? matchingDog.weight : null,
      gender: matchingDog ? matchingDog.gender : null,
      health: matchingDog ? matchingDog.health : null,
    };
  });
  res
    .status(StatusCodes.OK)
    .json(
      createResponseData(
        { allSales: salesWithDogs },
        false,
        "All Sales Records Found."
      )
    );
});

// Get Sale
const getSale = asyncWrapper(async (req, res) => {
  const { dogId } = req.params;
  if (!dogId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Dog ID."));
  }

  const sale = await Sales.findOne({ dogId });
  if (!sale) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createResponseData(null, true, "Sale Record Not Found."));
  }
  const dog = await Dog.findOne({ dogId });
  if (!dog) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createResponseData(null, true, "Dog Record Not Found."));
  }
  const saleWithDog = {
    sale: {
      ...sale._doc,
      weight: dog.weight || null,
      gender: dog.gender || null,
      health: dog.health || null,
    },
  };
  res
    .status(StatusCodes.OK)
    .json(createResponseData(saleWithDog, false, "Sale Record Found."));
});

// Update Sale Record
const updateSale = asyncWrapper(async (req, res) => {
  const { saleId } = req.params;
  if (!saleId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide SaleId."));
  }
  const data = { ...req.body };
  if (Object.keys(data).length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Data."));
  }
  const updatedSale = await Sales.findOneAndUpdate(
    { Id: saleId },
    { $set: data },
    { new: true }
  );
  if (!updatedSale) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createResponseData(null, true, `No Sales With ${saleId} is Found.`)
      );
  }
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        updatedSale: updatedSale,
      },
      false,
      `Sale with Id: ${saleId} has been Updated.`
    )
  );
});

// Delete Sale Record
const deleteSale = asyncWrapper(async (req, res) => {
  const { saleId } = req.params;
  if (!saleId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide SalesId."));
  }
  const sale = await Sales.findOneAndDelete({ Id: saleId });
  if (!sale) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Invalid Sales Id."));
  }
  res
    .status(StatusCodes.OK)
    .json(
      createResponseData(
        null,
        false,
        `Sales with Id: ${saleId} has been deleted.`
      )
    );
});

module.exports = {
  registerSales,
  getSale,
  getAllSales,
  updateSale,
  deleteSale,
};
