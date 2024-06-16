const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../../middleware/asyncWrapper");
const Order = require("../../models/Order");
const https = require("https");

// Function to create consistent response data
const createResponseData = (payload, hasErrors, message) => {
  return {
    payload,
    hasErrors,
    message,
  };
};

const PAYSTACK_KEY = process.env.PAYSTACK_KEY;

// create new order
// const createOrder = asyncWrapper(async (req, res) => {
//   const { id } = req.currentUser;
//   const Order = await Order.create({ ...req.body, user: id });
//   res.status(StatusCodes.OK).json(
//     createResponseData(
//       {
//         Order: Order,
//       },
//       false,
//       "New Order Added successfully."
//     )
//   );
// });

// get Order
const getOrder = asyncWrapper(async (req, res) => {
  const { OrderId } = req.params;
  if (!OrderId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Order Id."));
  }
  const Order = await Order.findOne({ _id: OrderId });
  if (!Order) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Order Does Not Exist."));
  }
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        Order: Order,
      },
      false,
      "Order Is Fetched successfully ."
    )
  );
});

// get all orders
const getAllOrders = asyncWrapper(async (req, res) => {
  const order = await Order.find();
  if (Order.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json(createResponseData({}, false, "User hasn't created any Order."));
  }
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        Order: Order,
      },
      false,
      "Orders Fetched successfully ."
    )
  );
});

//create payment page
const createPayment = asyncWrapper(async (req, res) => {
  console.log(PAYSTACK_KEY);
  if (!req.body.email || !req.body.amount) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide both email and amount.",
    });
  }

  const params = JSON.stringify({
    email: req.body.email,
    amount: req.body.amount * 100,
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

  const request = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      console.log(JSON.parse(data));
      res.status(response.statusCode).json(JSON.parse(data));
    });
  });

  request.on("error", (error) => {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  });

  request.write(params);
  request.end();
});

const getTransactionStatus = asyncWrapper(async (req, res) => {
  const { reference } = req.params;

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_KEY}`,
    },
  };

  const request = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const responseData = JSON.parse(data);
      console.log(responseData); // Log the response data for debugging

      // Example: Send the response back to the client
      res.status(response.statusCode).json(responseData);
    });
  });

  // Handle errors in making the request
  request.on("error", (error) => {
    console.error(error);
    // Example: Handle the error response
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  });

  // End the request
  request.end();
});

const updateTransactionStatus = asyncWrapper(async (req, res) => {
  const Order = await Order.findByIdAndUpdate(
    { _id: req.body.id },
    { $set: { transactionStatus: true } },
    { new: true }
  );
  if (!Order) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createResponseData(null, false, "Order does not exist."));
  }

  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        Order: Order,
      },
      false,
      "Transaction is successful."
    )
  );
});

module.exports = {
  // createOrder,
  createPayment,
  getTransactionStatus,
  updateTransactionStatus,
  getAllOrders,
  getOrder,
};
