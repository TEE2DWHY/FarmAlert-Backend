const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoId = customAlphabet("1234567890abcde", 4);

const cattleSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  tagId: {
    type: String,
    required: [true, "Please Provide Cattle Tag Id."],
  },
  farmAddress: {
    type: String,
    required: [true, "Please Provide Cattle Address."],
  },
  state: {
    type: String,
  },
  lga: {
    type: String,
  },
  animalType: {
    type: String,
    required: [true, "Please Specify Animal Type."],
  },
  DOB: {
    type: String,
  },
  age: {
    type: String,
  },
  group: {
    type: [String],
  },
  gender: {
    type: String,
  },
  color: {
    type: String,
  },
  weight: {
    type: String,
  },
  health: {
    type: String,
  },
  breed: {
    type: String,
  },
  source: {
    type: String,
  },
  dateOfEntry: {
    type: String,
  },
  deliveries: {
    type: String,
  },
  status: {
    type: String,
    required: [true, "Please Provide Cattle Status."],
  },
  id: {
    type: String,
    default: `NGN0000${nanoId()}`,
  },
  health: {
    type: String,
    required: [true, "Please Provide Cattle Health Status."],
  },
  image: {
    type: String,
    required: [true, "Please Provide Vaccination Image"],
  },
  // sales: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Sales",
  // },
  // health: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Health",
  // },
  registeredBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: [true, "Cannot Get Agent"],
    },
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Cannot Get User. "],
    },
  ],
});

module.exports = mongoose.model("Cattle", cattleSchema);
