const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  tagNumber: {
    type: String,
    required: [true, "Please provide product name"],
  },
  description: {
    type: String,
    required: [true, "Please provide product name"],
  },
  color: {
    type: String,
  },
  price: {
    type: String,
    required: [true, "Please provide price"],
  },
  quantity: {
    type: String,
    required: [true, "Please provide quantity"],
  },
  shippingDetails: {
    address: {
      type: String,
      required: [true, "Please provide shipping address"],
    },
  },
  totalCost: {
    type: String,
  },
  orderStatus: {
    type: String,
    enum: ["pending", "successful", "reversed", "failed"],
    default: "pending",
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: [true, "Please Provide Product Id."],
  },
  paymentDetails: {
    paymentUrl: {
      type: String,
    },
    reference: {
      type: String,
    },
    accessCode: {
      type: String,
    },
  },
  user: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      type: mongoose.Types.ObjectId,
      ref: "Agent",
    },
  ],
});

module.exports = mongoose.model("Order", OrderSchema);
