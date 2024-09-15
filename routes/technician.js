const express = require("express");
const catalyst = require("zcatalyst-sdk-node");
const controller = require("../controllers/technician");

const router = express.Router();

// Get All patient details of the receptionist's hospital
router.get("/:hospitalId/patient/all", async (req, res) => {
  const capp = catalyst.initialize(req);
  const hospitalId = req.params.hospitalId;
  console.log("Hospital Id",hospitalId);
  try {
    let items = await controller.getPatientForReceptionist.all(
      capp,
      hospitalId,
      []
    );
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get patient by Id
router.get("/:hospitalId/patient/:patientId", async (req, res) => {
  const capp = catalyst.initialize(req);
  const hospitalId = req.params.hospitalId;
  const patientId = req.params.patientId;
  try {
    let items = await controller.getPatientForReceptionist.patient(
      capp,
      hospitalId,
      patientId
    );
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update Existing Patient
router.post("/:hospitalId/patient/:patientId", async (req, res) => {
  const capp = catalyst.initialize(req);
  const hospitalId = req.params.hospitalId;
  const patientId = req.params.patientId;
  const updateData = req.body; // Data to be updated
  try {
    let updatedPatient =
      await controller.getPatientForReceptionist.updatePatient(
        capp,
        hospitalId,
        patientId,
        updateData
      );
    return res.status(200).json(updatedPatient);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Create New Patient
router.post("/:receptionistId/patient", async (req, res) => {
  const capp = catalyst.initialize(req);
  const patientData = req.body; // Should include patient details
  try {
    let newPatient = await controller.getPatientForReceptionist.createPatient(
      capp,
      patientData
    );
    return res.status(201).json(newPatient);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get All appointment details under Hospital of the receptionist
router.get("/:hospitalId/appointment/all", async (req, res) => {
  const capp = catalyst.initialize(req);
  const hospitalId = req.params.hospitalId;
  try {
    let items = await controller.getAppointmentsForReceptionist.all(
      capp,
      hospitalId,
      []
    );
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get appointment by Id
router.get("/:hospitalId/appointment/:appointmentId", async (req, res) => {
  const capp = catalyst.initialize(req);
  const hospitalId = req.params.hospitalId;
  const appointmentId = req.params.appointmentId;
  try {
    let items = await controller.getAppointmentsForReceptionist.appointment(
      capp,
      hospitalId,
      appointmentId
    );
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update Existing Appointment
router.post("/:hospitalId/appointment/:appointmentId", async (req, res) => {
  const capp = catalyst.initialize(req);
  const hospitalId = req.params.hospitalId;
  const appointmentId = req.params.appointmentId;
  const updateData = req.body; // Data to be updated
  try {
    let updatedAppointment =
      await controller.getAppointmentsForReceptionist.updateAppointment(
        capp,
        hospitalId,
        appointmentId,
        updateData
      );
    return res.status(200).json(updatedAppointment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Adding Bills by receptionist
router.post("/:receptionistId/:hospitalId/bill", async (req, res) => {
  const capp = catalyst.initialize(req);
  const hospitalId = req.params.hospitalId;
  const receptionistId = req.params.receptionistId;
  const Data = req.body; // Data to be updated
  try {
    let Bill = await controller.BillsForReceptionist.AddBill(
      capp,
      hospitalId,
      receptionistId,
      Data
    );
    return res.status(200).json(Bill);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Editing Bills by receptionist
router.put("/:receptionistId/:hospitalId/bill/:billId", async (req, res) => {
  const capp = catalyst.initialize(req);
  const hospitalId = req.params.hospitalId;
  const receptionistId = req.params.receptionistId;
  const billId = req.params.billId;
  const data = req.body;
  try {
    let bill = await controller.BillsForReceptionist.EditBill(
      capp,
      hospitalId,
      receptionistId,
      billId,
      data
    );
    return res.status(200).json(bill);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Deleting Bills by receptionist
router.delete("/:receptionistId/:hospitalId/bill/:billId", async (req, res) => {
  const capp = catalyst.initialize(req);
  const hospitalId = req.params.hospitalId;
  const receptionistId = req.params.receptionistId;
  const billId = req.params.billId;
  try {
    let result = await controller.BillsForReceptionist.DeleteBill(capp, billId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  console.log("we have entered recep route");
  const capp = catalyst.initialize(req);
  const userId = req.params.userId;
  console.log("Here is the userId", userId);
  try {
    let items = await controller.BillsForReceptionist.getReceptionst(
      capp,
      userId
    );
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Getting perticulkar doctor
router.get("/doctor/:doctorId", async (req, res) => {
  const capp = catalyst.initialize(req);
  const doctor_id = req.params.doctorId;
  try {
    let doctor = await controller.BillsForReceptionist.getDoctor(
      capp,
      doctor_id
    );
    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Get all bills added by that receptionis
router.get("/bills/:id/all", async (req, res) => {
  const capp = catalyst.initialize(req);
  const id = req.params.id;
  try {
    let items = await controller.BillsForReceptionist.getBills(capp, id, []);
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Get Receptionist hospital
router.get("/hospital/:id", async (req, res) => {
  const capp = catalyst.initialize(req);
  const id = req.params.id;
  try {
    let hospital = await controller.BillsForReceptionist.getHospital(capp, id, []);
    return res.status(200).json(hospital);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
