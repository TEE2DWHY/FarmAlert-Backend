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
    enum: ["Paid", "Pending", "Successful", "Reversed", "Failed"],
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
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
