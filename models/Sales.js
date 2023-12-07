const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("0123456789abcde", 5);

const salesSchema = new mongoose.Schema({
  Id: {
    type: String,
    default: nanoid(),
  },
  uniqueNumber: {
    type: String,
  },
  ownerName: {
    type: String,
  },
  purchaseDetails: {
    market: {
      type: String,
    },
    state: {
      type: String,
    },
    lga: {
      type: String,
    },
  },
  transportationDetails: {
    truckNumber: {
      type: String,
    },
    driversName: {
      type: String,
    },
    driverPhoneNumber: {
      type: String,
    },
    transporterName: {
      type: String,
    },
    transporterPhoneNumber: {
      type: String,
    },
    DateDeparture: {
      type: String,
    },
    receiptSerialNumber: {
      type: String,
    },
  },
  financialInformation: {
    advancePaid: {
      type: String,
    },
    balanceToBePaid: {
      type: String,
    },
  },
  destinationInformation: {
    state: {
      type: String,
    },
    lga: {
      type: String,
    },
    nameOfMarketDestination: {
      type: String,
    },
    receiverName: {
      type: String,
    },
    receiverPhoneNumber: {
      type: String,
    },
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
