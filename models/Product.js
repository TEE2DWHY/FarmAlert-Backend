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
    type: Number,
    required: [true, "Please provide available stock for product"],
  },
  stockSold: {
    type: Number,
    required: [true, "Please provide the number stock sold"],
  },
  totalStock: {
    type: Number,
    required: [true, "Please provide the total stock"],
  },
  colorAvailable: {
    type: String,
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
