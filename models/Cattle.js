const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoId = customAlphabet("1234567890abcde", 5);

const cattleSchema = new mongoose.Schema({
  Id: {
    type: String,
    default: nanoId(),
  },
  farmNumber: {
    type: String,
    required: [true, "Please Provide Farm Number"],
  },
  vaccinationDate: {
    type: String,
    required: [true, "Please Specify Date of Vaccination"],
  },
  vaccineType: {
    type: String,
    required: [true, "Please Specify Type of Vaccination"],
  },
  dosageGiven: {
    type: String,
    required: [true, "Please Specify Dosage Given"],
  },
  veterinarianName: {
    type: String,
    required: [true, "Please Specify Name of Veterinarian"],
  },
  dateOfTreatment: {
    type: String,
    required: [true, "Please Specify Date of Treatment"],
  },
  treatmentType: {
    type: String,
    required: [true, "Please Specify Treatment Type"],
  },
  image: {
    type: String,
    required: [true, "Please Provide Vaccination Image"],
  },
  registeredBy: {
    type: mongoose.Types.ObjectId,
    ref: "Agent",
    required: [true, "Please Specify the Agent who Registered the Cattle. "],
  },
});

module.exports = mongoose.model("Cattle", cattleSchema);
