// controllers/patientController.js

const Patient = require("../models/Patient");

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPatient = async (data) => {
  const patient = new Patient(data);

  await patient.save();

  return patient;
};

module.exports = {
  getPatients,
  createPatient,
};
