const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({
  Id: {
    type: String,
  },
  vaccine: {
    type: String,
  },
  date: {
    type: String,
  },
  age: {
    type: String,
  },
  medication: {
    type: String,
  },
  dosage: {
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

module.exports = mongoose.model("Health", healthSchema);
