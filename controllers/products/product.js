const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../../middleware/asyncWrapper");
const Product = require("../../models/Product");
const https = require("https");
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
  const { id } = req.currentUser;
  const product = await Product.create({ ...req.body, user: id });
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        product: product,
      },
      false,
      "New Product Added successfully."
    )
  );
});

// get product
const getProduct = asyncWrapper(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res
      .status(StatusCodes.OK)
      .json(createResponseData(null, true, "Please Provide Product Id."));
  }
  console.log(productId);
});

//create payment page
const createPayment = asyncWrapper(async (req, res) => {
  const { id, name } = req.currentUser;
  const params = JSON.stringify({
    email: "customer@email.com",
    amount: "20000",
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const request = https
    .request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });

  request.write(params);
  request.end();
});

const getTransactionStatus = asyncWrapper(async (req, res) => {
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/verify/:reference",
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_KEY}`,
    },
  };
  https
    .request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });
});

const updateTransactionStatus = asyncWrapper(async (req, res) => {
  const product = await Product.findById({ _id: req.body.id });
  if (!product) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createResponseData(null, false, "Product does not exist."));
  }
  product.transactionStatus = true;
  await product.save();
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        product: product,
      },
      false,
      "Transaction is successful."
    )
  );
});

module.exports = {
  createProduct,
  createPayment,
  getTransactionStatus,
  updateTransactionStatus,
  getProduct,
};
