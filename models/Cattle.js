const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoId = customAlphabet("1234567890abcde");

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
    type: Date,
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
    type: Date,
    required: [true, "Please Specify Date of Treatment"],
  },
  treatmentType: {
    type: String,
    required: [true, "Please Specify Treatment Type"],
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Cattle", cattleSchema);
