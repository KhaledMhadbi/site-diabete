const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  glucose: {
    type: Number,
    required: true,
  },
  insulin: {
    type: Number,
    required: [true, "Insulin dosage/level is required"],
    min: 0,
  },
  heure: {
    type: String,
    required: [true, "Measurement time is required"],
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Patient", PatientSchema);
