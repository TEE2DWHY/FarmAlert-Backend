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
  if (allProducts.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json(createResponseData(null, false, "No Product Has Been Created."));
  }
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        allProducts: allProducts,
      },
      false,
      "All Products Returned Successfully."
    )
  );
});

// delete specific product
const deleteProduct = asyncWrapper(async (req, res) => {
  const { productId } = req.params;

  // Check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createResponseData(null, true, "Product not found."));
  }

  // Delete product from database
  await Product.findByIdAndDelete(productId);

  // Optionally, delete associated image from Cloudinary
  // if (product.image) {
  //   await cloudinary.uploader.destroy(product.image.public_id);
  // }
  res
    .status(StatusCodes.OK)
    .json(createResponseData(null, false, "Product deleted successfully."));
});

const updateProductColors = asyncWrapper(async (req, res) => {
  const { productId } = req.params;
  const { colors } = req.body;

  // Check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createResponseData(null, true, "Product not found."));
  }

  // Push new colors to the existing array
  product.colorAvailable.push(...colors);
  await product.save();

  res
    .status(StatusCodes.OK)
    .json(
      createResponseData({ product }, false, "Colors updated successfully.")
    );
});

module.exports = {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProductColors,
};