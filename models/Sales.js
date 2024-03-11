const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  cattleId: {
    type: String,
    required: [true, "Please Provide cattleId."],
  },
  date: {
    type: String,
    required: [true, "Please Specify Date."],
  },
  receiversName: {
    type: String,
    required: [true, "Please Specify Receiver Name."],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please Specify Receiver Name."],
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
  market: {
    type: String,
    required: [true, "Please Specify Market"],
  },
  driversName: {
    type: String,
    required: [true, "Please Specify Drivers Details"],
  },
  driverNumber: {
    type: String,
    required: [true, "Please Provide Drivers Number."],
  },
  truckNumber: {
    type: String,
    required: [true, "Please Provide Truck Number."],
  },
  dateOfDeparture: {
    type: String,
    required: [true, "Please Provide Date of Departure."],
  },
  receiptNumber: {
    type: String,
    required: [true, "Please Provide Receipt Serial Number."],
  },
  price: {
    type: String,
    required: [true, "Please Provide Payment."],
  },
  amountPaid: {
    type: String,
    required: [true, "Please Provide Amount Paid."],
  },
  outstanding: {
    type: String,
    required: [true, "Please Provide Outstanding."],
  },
  paymentMethod: {
    type: String,
    required: [true, "Please Provide Payment Method."],
  },
  image: {
    type: String,
    required: [true, "Please Provide Truck Image."],
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
