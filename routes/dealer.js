const catalyst = require("zcatalyst-sdk-node");
const controller = require("../controllers/dealer")
const express = require("express");
const router = express.Router();

// Get All patient details of Doctor's hospital
router.get("/:doctorId/patients/all", async (req, res) => {
  const capp = catalyst.initialize(req);
  const doctorId = req.params.doctorId; // This should ideally come from req.params or req.user
  try {
    let items = await controller.getPatientFromHospital.all(capp, doctorId, []);
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get particular patient detail of Doctor's hospital
router.get("/:doctorId/patients/:patientId", async (req, res) => {
  const capp = catalyst.initialize(req);
  const doctorId = req.params.doctorId;
  const patientId = req.params.patientId;
  try {
    let items = await controller.getPatientFromHospital.patient(
      capp,
      doctorId,
      patientId
    );
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update particular patient detail
router.post("/:doctorId/patients/:patientId", async (req, res) => {
  const capp = catalyst.initialize(req);
  const doctorId = req.params.doctorId;
  const patientId = req.params.patientId;
  const updateData = { patient_status: "Consulted" };
  try {
    let updatedPatient = await controller.getPatientFromHospital.updatePatient(
      capp,
      doctorId,
      patientId,
      updateData
    );
    return res.status(200).json(updatedPatient);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all appointment details under Doctor
router.get("/:doctorId/appointments/all", async (req, res) => {
  const capp = catalyst.initialize(req);
  const doctorId = req.params.doctorId; // This should ideally come from req.params or req.user
  try {
    let items = await controller.getAppointmentsFromHospitals.all(
      capp,
      doctorId,
      []
    );
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get particular appointment detail
router.get("/:doctorId/appointments/:appointmentId", async (req, res) => {
  const capp = catalyst.initialize(req);
  const doctorId = req.params.doctorId;
  const appointmentId = req.params.appointmentId;
  try {
    let items = await controller.getAppointmentsFromHospitals.appointment(
      capp,
      doctorId,
      appointmentId
    );
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/:doctorId/:patientId", async (req, res) => {
  const capp = catalyst.initialize(req);
  const doctorId = req.params.doctorId;
  const patientId = req.params.patientId;
  const updateData = { patient_status: "Consulted" };
  try {
    let updatedPatient = await controller.getPatientFromHospital.updatePatient(
      capp,
      doctorId,
      patientId,
      updateData
    );
    return res.status(200).json(updatedPatient);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//add treatement
router.post("/patient/addtreatement/:patientId", async (req, res) => {
  // console.log("Hello MikeCheck");
  const capp = catalyst.initialize(req);
  const patientId = req.params.patientId;
  const data = req.body;
  try {
    let history = await controller.patientHistory.AddTreatement(
      capp,
      patientId,
      data
    );
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/patientHistory", async (req, res) => {
  const capp = catalyst.initialize(req);
  try {
    let history = await controller.patientHistory.all(capp);
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Editing Treatment by doctor
router.put(
  "/treatement/:doctorId/:patientId/:treatmentId",
  async (req, res) => {
    const capp = catalyst.initialize(req);
    const doctorId = req.params.doctorId;
    const patientId = req.params.patientId;
    const treatmentId = req.params.treatmentId;
    const data = req.body;
    try {
      let history = await controller.patientHistory.EditTreatement(
        capp,
        doctorId,
        patientId,
        treatmentId,
        data
      );
      return res.status(200).json(history);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// Deleting Treatment by doctor
router.delete(
  "/treatement/:doctorId/:patientId/:treatmentId",
  async (req, res) => {
    const capp = catalyst.initialize(req);
    const doctorId = req.params.doctorId;
    const patientId = req.params.patientId;
    const treatmentId = req.params.treatmentId;
    try {
      let result = await controller.patientHistory.DeleteTreatement(
        capp,
        doctorId,
        patientId,
        treatmentId
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get("/patient/:patientId/history", async (req, res) => {
  const capp = catalyst.initialize(req);
  // const doctorId = req.params.doctorId;
  const patientId = req.params.patientId;
  try {
    let items = await controller.patientHistory.getPatientHistory(
      capp,
      patientId
    );
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update an appointment
router.put("/appointment/:id", async (req, res) => {
  console.log("I am entered");
  const capp = catalyst.initialize(req);
  const appointmentId = req.params.id;
  const appointmentData = req.body; // Should include appointment details to be updated
  try {
    let updatedAppointment =
      await controller.getAppointmentsFromHospitals.updateAppointment(
        capp,
        appointmentId,
        appointmentData
      );
    return res.status(200).json(updatedAppointment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/addServices", async (req, res) => {
  console.log("Enterd treatement");
  const capp = catalyst.initialize(req);
  const Data = req.body;
  try {
    let history = await controller.ServicesMedicines.AddServices(capp, Data);
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/addMedicines", async (req, res) => {
  console.log("Medicines");
  const capp = catalyst.initialize(req);
  const Data = req.body;
  try {
    let history = await controller.ServicesMedicines.AddMedicines(capp, Data);
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/treatments", async (req, res) => {
  const capp = catalyst.initialize(req);
  try {
    let treatements = await controller.ServicesMedicines.getTreatements(capp);
    return res.status(200).json(treatements);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/medicines", async (req, res) => {
  const capp = catalyst.initialize(req);
  try {
    let medicines = await controller.ServicesMedicines.getMedicines(capp);
    return res.status(200).json(medicines);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// treatement given by doctors

router.get("/:name/treatements/all", async (req, res) => {
  const capp = catalyst.initialize(req);
  const name = req.params.name;
  console.log(name);
  try {
    let treatements = await controller.patientHistory.AllTreatements(capp,name);
    return res.status(200).json(treatements);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


//for dashboard quick response apis

router.get("/count/:doctorId/appointments", async (req, res) => {
  const capp = catalyst.initialize(req);
  const doctorId = req.params.doctorId;
  console.log(doctorId);
  try {
    let treatements = await controller.dashboardData.GetAppointmenttCount(capp,doctorId);
    return res.status(200).json(treatements);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


//editing the treatement service

router.put("/treatement/:id", async (req, res) => {
  console.log("I am entered");
  const capp = catalyst.initialize(req);
  const treatementId = req.params.id;
  const updatedData = req.body; // Should include appointment details to be updated
  try {
    let updatedTreatement =
      await controller.ServicesMedicines.updateTreatment(
        capp,
        treatementId,
        updatedData
      );
    return res.status(200).json(updatedTreatement);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Delete treatement/service
router.delete(
  "/treatement/:treatmentId",
  async (req, res) => {
    const capp = catalyst.initialize(req);
    const treatmentId = req.params.treatmentId;
    try {
      let result = await controller.ServicesMedicines.DeleteService(
        capp,
        treatmentId
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

//Updating/editing the medicine
router.put("/medicine/:id", async (req, res) => {
  console.log("I am entered");
  const capp = catalyst.initialize(req);
  const medicineId = req.params.id;
  const updatedData = req.body; // Should include appointment details to be updated
  try {
    let updatedMedicine =
      await controller.ServicesMedicines.updateMedicine(
        capp,
        medicineId,
        updatedData
      );
    return res.status(200).json(updatedMedicine);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Delete Medicine
router.delete(
  "/medicine/:medicineId",
  async (req, res) => {
    const capp = catalyst.initialize(req);
    const medicineId = req.params.medicineId;
    try {
      let result = await controller.ServicesMedicines.DeleteMedicine(
        capp,
        medicineId
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

//Getting bills about that perticular doctor
router.get("/bills/:id", async (req, res) => {
  const capp = catalyst.initialize(req);
  const id = req.params.id;
  try {
    let bills = await controller.ServicesMedicines.GetAllBills(capp,id);
    return res.status(200).json(bills);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



module.exports = router;
