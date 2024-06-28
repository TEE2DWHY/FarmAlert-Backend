const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "Please provide product image"],
  },
  name: {
    type: String,
    required: [true, "Please provide product name"],
  },
  description: {
    type: String,
    required: [true, "Please provide product description"],
  },
  price: {
    type: String,
    required: [true, "Please provide product price"],
  },
  stockAvailable: {
    address: {
      type: Number,
      required: [true, "Please provide available stock for product"],
    },
  },
  stockSold: {
    address: {
      type: Number,
      required: [true, "Please provide the number stock sold"],
    },
  },
  stockSold: {
    address: {
      type: Number,
      required: [true, "Please provide the total stock"],
    },
  },
  colorAvailable: {
    type: String,
    required: [true, "Please provide available color"],
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
    type: [String],
    required: [true, "Please provide available color"],
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
