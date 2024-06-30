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

const createPayment = (email, amount) => {
  return new Promise((resolve, reject) => {
    const PAYSTACK_KEY = process.env.PAYSTACK_KEY;

    if (!PAYSTACK_KEY) {
      reject(new Error("Paystack key is not provided"));
      return;
    }

    const params = JSON.stringify({
      email: email,
      amount: amount * 100, // convert to kobo (Paystack requires amount in kobo)
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
        resolve({
          paymentUrl: data.authorization_url,
          reference: data.reference,
          accessCode: data.access_code,
        });
      });
    });

    request.on("error", (error) => {
      reject(error);
    });

    request.write(params);
    request.end();
  });
};

// Function to create an order with integrated payment
const createOrder = asyncWrapper(async (req, res) => {
  const { id } = req.currentUser; // Assuming currentUser contains user ID
  const { productId } = req.params;

  // Validate productId
  if (!productId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponseData(null, true, "Please provide Product Id."));
  }

  try {
    // Create the order
    const newOrder = await Order.create({ ...req.body, user: id });

    // Create payment with user's email and totalCost (assuming totalCost is in req.body)
    const { email, totalCost } = req.body;
    const paymentDetails = await createPayment(email, totalCost);

    // Respond with order and payment details
    res.status(StatusCodes.OK).json(
      createResponseData(
        {
          newOrder,
          paymentDetails,
        },
        false,
        "Order created successfully with payment details."
      )
    );
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
});

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

const getOrderStatus = asyncWrapper(async (req, res) => {
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
  createOrder,
  getOrderStatus,
  updateTransactionStatus,
  getAllOrders,
  getOrder,
};
