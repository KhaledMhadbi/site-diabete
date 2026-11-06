const express = require("express");
const cors = require("cors");

const {
  getPatients,
  createPatient,
} = require("./controllers/patientController");
const connectDB = require("./db/config");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT,
    );
  else console.log("Error occurred, server can't start", error);
});

connectDB();

app.get("/api/patients", getPatients);
app.post("/api/patients", createPatient);
