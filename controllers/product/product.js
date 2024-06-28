const asyncWrapper = require("../../middleware/asyncWrapper");
const Product = require("../../models/Product");
const cloudinary = require("../../utils/cloudinary");
const { StatusCodes } = require("http-status-codes");

// Function to create consistent response data
const createResponseData = (payload, hasErrors, message) => {
  return {
    payload,
    hasErrors,
    message,
  };
};

// create new product
const createProduct = asyncWrapper(async (req, res) => {
  let result;
  try {
    const { id } = req.currentUser;
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createResponseData(null, true, "Please Upload Product Image."));
    }
    const { path } = req.file;
    result = await cloudinary.uploader.upload(path);
    const newProduct = await Product.create({
      ...req.body,
      user: id,
      image: result.secure_url,
    });
    res.status(StatusCodes.OK).json(
      createResponseData(
        {
          newProduct: newProduct,
        },
        false,
        "New Order Added successfully."
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

const getAllProducts = asyncWrapper(async (req, res) => {
  const allProducts = await Product.find();
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        allProducts: allProducts,
      },
      false,
      "All Products Returned  successfully."
    )
  );
});

module.exports = { createProduct, getAllProducts };
