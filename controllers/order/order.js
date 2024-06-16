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
  const { orderId } = req.params;
  if (!orderId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please Provide Order Id."));
  }
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Order Does Not Exist."));
  }
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        order: order,
      },
      false,
      "Order Is Fetched successfully ."
    )
  );
});

// get all orders
const getAllOrders = asyncWrapper(async (req, res) => {
  const order = await Order.find();
  if (order.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json(createResponseData({}, false, "User hasn't created any Order."));
  }
  res.status(StatusCodes.OK).json(
    createResponseData(
      {
        order: order,
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
    amount: req.body.amount * 100, // because paystack by default is in kobo
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
    let txData = "";

    response.on("data", (chunk) => {
      txData += chunk;
    });

    response.on("end", () => {
      const responseData = JSON.parse(txData);
      const { data } = responseData;
      res.status(response.statusCode).json(
        createResponseData(
          {
            paymentUrl: data.authorization_url,
            reference: data.reference,
            accessCode: data.access_code,
          },
          false,
          "Payment Url Returned Successfully."
        )
      );
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
  try {
    const { reference } = req.params;
    if (!reference) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide a transaction reference number",
      });
    }
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
      let txData = "";
      response.on("data", (chunk) => {
        txData += chunk;
      });
      response.on("end", () => {
        try {
          const responseData = JSON.parse(txData);

          if (response.statusCode !== 200) {
            // Handle Paystack API error responses
            return res
              .status(response.statusCode)
              .json(createResponseData(null, true, responseData.message));
          }

          const { data } = responseData;
          console.log(responseData); // Log the response data for debugging

          res.status(response.statusCode).json(
            createResponseData(
              {
                id: data.id,
                status: data.status,
                reference: data.reference,
                amount: data.amount / 100,
                email: data.customer.email,
              },
              false,
              "Transaction Order Details Retrieved Successfully."
            )
          );
        } catch (error) {
          console.error("Error parsing response:", error);
          res.status(500).json({ error: "Error parsing Paystack response" });
        }
      });
    });

    request.on("error", (error) => {
      console.error("Request error:", error);
      res
        .status(500)
        .json({ error: "An error occurred while processing your request." });
    });

    // End the request
    request.end();
  } catch (error) {
    console.error("Catch block error:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

const updateTransactionStatus = asyncWrapper(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    { _id: req.body.id },
    { $set: { transactionStatus: true } },
    { new: true }
  );
  if (!order) {
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
