const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("1234567890abcde", 5);

const agentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Provide Email"],
    unique: [true, "Email Already Exist."],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: String,
    required: [true, "Please Provide Phone Number"],
    unique: [true, "Phone Number Already Exist"],
  },
  Id: {
    type: String,
    default: nanoid(),
  },
  fullName: {
    type: String,
    required: [true, "Please Provide Name"],
  },
  address: {
    type: String,
    required: [true, "Please Specify Your Address."],
    // enum: {
    //   values: ["abuja", "lagos", "kogi", "ogun"],
    //   message: "{VALUE} is not supported",
    // },
  },
  state: {
    type: String,
    required: [true, "Please Specify Your State"],
  },
  lga: {
    type: String,
    required: [true, "Please Specify Your LGA"],
  },
  cattleAmount: {
    type: String,
  },
  salesTransaction: {
    type: String,
  },
  salesCommission: {
    type: String,
  },
  rating: {
    type: String,
    default: "0",
  },
  password: {
    type: String,
    required: [true, "Please Provide Password"],
  },
  role: {
    type: String,
    default: "agent",
  },
});

module.exports = mongoose.model("Agent", agentSchema);
