const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema({
  tagId: {
    type: String,
  },
  vaccine: {
    type: String,
  },
  date: {
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

const medicationSchema = new mongoose.Schema({
  tagId: {
    type: String,
  },
  medication: {
    type: [String],
  },
  dosage: {
    type: [String],
  },
  date: {
    type: [String],
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

const pregnantSchema = new mongoose.Schema({
  tagId: {
    type: String,
  },
  gestationDate: {
    type: String,
  },
  expectedDeliveryDate: {
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

const vetVisitSchema = new mongoose.Schema({
  tagId: {
    type: String,
  },
  date: {
    type: String,
  },
  reasonForVisit: {
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

const birthSchema = new mongoose.Schema({
  tagId: {
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

const deathSchema = new mongoose.Schema({
  tagId: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  dateOfDeath: {
    type: String,
  },
  causeOfDeath: {
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

const Vaccination = mongoose.model("Vaccination", vaccinationSchema);
const Medication = mongoose.model("Medication", medicationSchema);
const Pregnant = mongoose.model("Pregnant", pregnantSchema);
const VetVisit = mongoose.model("VetVisit", vetVisitSchema);
const Birth = mongoose.model("Birth", birthSchema);
const Death = mongoose.model("Death", deathSchema);

module.exports = { Vaccination, Medication, Pregnant, VetVisit, Death, Birth };
