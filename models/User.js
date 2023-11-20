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
  address: {
    type: String,
    required: [true, "Please Specify Your Address."],
  },
  state: {
    type: String,
    required: [true, "Please Specify Your State"],
  },
  lga: {
    type: String,
    required: [true, "Please Specify Your LGA"],
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
  vcnNumber: {
    type: String,
    required: function () {
      return this.role === "veterinarian";
    },
  },
  practiceName: {
    type: String,
    required: function () {
      return this.role === "veterinarian";
    },
  },
});

userSchema.pre("save", function (next) {
  if (this.role !== "veterinarian") {
    this.vcnNumber = undefined;
    this.practiceName = undefined;
  }
  next();
});

module.exports = mongoose.model("Users", userSchema);
