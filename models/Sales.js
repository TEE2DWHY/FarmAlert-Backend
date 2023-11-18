const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  Id: {
    type: String,
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
  // Documentation:
  // Upload pictures of Truck and Cattle
});

module.exports = mongoose.model("Sales", salesSchema);
