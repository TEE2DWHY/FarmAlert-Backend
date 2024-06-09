const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
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
    address: String,
    required: [true, "Please provide shipping address"],
  },
  petDetails: {
    petName: {
      type: String,
      required: [true, "Please provide petName"],
    },
    age: {
      type: String,
      required: [true, "Please provide pet age"],
    },
    breed: {
      type: String,
      required: [true, "Please provide pet breed"],
    },
    color: {
      type: String,
      required: [true, "Please provide pet color"],
    },
    farmOwned: {
      type: String,
      required: [true, "Please provide farm owned"],
    },
  },
  paymentDetails: {
    cardHolderName: {
      address: String,
      required: [true, "Please provide card holder name"],
    },
    cardNumber: {
      address: String,
      required: [true, "Please provide card number"],
    },
    expiryDate: {
      month: {
        type: String,
      },
      year: {
        type: String,
      },
      securityCode: {
        type: String,
      },
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

module.exports = mongoose.model("Product", ProductSchema);
