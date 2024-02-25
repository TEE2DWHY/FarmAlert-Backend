const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
  farmName: {
    type: String,
  },
  ownersName: {
    type: String,
    required: [true, "Please Provide Owners Name."],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please Provide PhoneNumber."],
  },
  address: {
    type: String,
    required: [true, "Please Provide Address."],
  },
  state: {
    type: String,
    required: [true, "Please Provide State."],
  },
  lga: {
    type: String,
    required: [true, "Please Provide LGA."],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: [true, "Please Provide AgentId"],
  },
});

module.exports = mongoose.model("Farm", farmSchema);
