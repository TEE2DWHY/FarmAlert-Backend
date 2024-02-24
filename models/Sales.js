const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  Id: {
    type: String,
  },
  health: {
    type: String,
  },
  ownerName: {
    type: String,
  },
  price: {
    type: String,
  },
  status: {
    type: String,
  },
  createdBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: [true, "Please Specify Agent."],
    },
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Specify User."],
    },
  ],
});

module.exports = mongoose.model("Sales", salesSchema);
