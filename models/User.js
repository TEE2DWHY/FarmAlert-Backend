const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoId = customAlphabet("0123456789abcde", 5);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Provide Email."],
    unique: [true, "Email is Already Taken"],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  Id: {
    type: String,
    default: nanoId(),
  },
  fullName: {
    type: String,
    required: [true, "Please Provide Name"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please Provide Name"],
    unique: [true, "phoneNumber is Already Taken"],
  },
  role: {
    type: String,
    required: [true, "Please Provide Role"],
  },
  farm: {
    type: String,
    required: [true, "Please Provide Farm Name"],
    // enum: {
    //   values: ["abuja", "lagos", "kogi", "ogun"],
    //   message: "{VALUE} is not supported",
    // },
  },
  healthRecords: {
    type: String,
  },
  transactions: {
    cattleSales: {
      type: String,
    },
    financialRecords: {
      type: String,
    },
  },
  password: {
    type: String,
    required: [true, "Please Provide Password"],
  },
});

module.exports = mongoose.model("Users", userSchema);
