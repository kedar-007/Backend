
exports.getPatientForReceptionist = {
  // Get all patient fromn particular hospital
  all: async (capp, hospitalId, fallback = undefined) => {
    console.log("Hospital Id", hospitalId);
    let items = await capp
      .zcql()
      .executeZCQLQuery(
        `SELECT * FROM Patients WHERE hospital_id = ${hospitalId}`
      )
      .catch(() => null);

    if (items == null || items == undefined) {
      return fallback;
    }
    return items.map((item) => item["Patients"]);
  },
  patient: async (capp, hospitalId, patientId) => {
    const zcql = capp.zcql();
    const query = `SELECT * FROM ${patients.table_name} WHERE hospital_id = ${hospitalId} AND ROWID = ${patientId}`;
    const queryResp = await zcql.executeZCQLQuery(query).catch(() => null);
    if (queryResp == null || queryResp.length === 0) {
      throw new Error("Patient not found");
    }
    return queryResp[0];
  },
  updatePatient: async (capp, hospitalId, patientId, updateData) => {
    // console.log("Updating Patient with ID:", patientId);
    // console.log("Update data:", updateData);

    const datastore = capp.datastore();
    const table = datastore.table("Patients");

    // Construct a JSON Object with the updated row details
    let updatedRowData = {
      ROWID: patientId,
      ...updateData,
    };

    try {
      // Use Table Meta Object to update a single row using ROWID which returns a promise
      let rowPromise = table.updateRow(updatedRowData);

      // Wait for the update operation to complete
      let updatedRow = await rowPromise;

      // console.log("Row updated successfully:", updatedRow);
      return updatedRow;
    } catch (error) {
      console.error("Failed to update the row:", error);
      throw new Error("Failed to update hospital");
    }
  },
  createPatient: async (capp, patientData) => {
    // console.log("Here patientData", patientData);
    const {
      patient_name,
      phone,
      address,
      date_of_birth,
      gender,
      hospital_id,
      doctor_id,
      date_of_admission,
    } = patientData;

    const rowData = {
      patient_name,
      address,
      phone,
      date_of_birth,
      gender,
      hospital_id,
      doctor_id,
      date_of_admission,
    };
    // console.log("here is the row data", rowData);
    try {
      const row = await capp.datastore().table("Patients").insertRow(rowData);
      return row;
    } catch (error) {
      console.error("Failed to create patient:", error);
      throw new Error("Failed to create patient");
    }
  },
};

exports.getAppointmentsForReceptionist = {
  all: async (capp, hospitalId, fallback = undefined) => {
    let items = await capp
      .zcql()
      .executeZCQLQuery(
        `SELECT * FROM ${appointments.table_name} WHERE hospital_id = ${hospitalId}`
      )
      .catch(() => null);

    if (items == null || items == undefined) {
      return fallback;
    }
    return items.map((item) => item[appointments.table_name]);
  },

  //Get particular appointment from hospital
  appointment: async (capp, hospitalId, appointmentId) => {
    const zcql = capp.zcql();
    const query = `SELECT * FROM ${appointments.table_name} WHERE hospital_id = ${hospitalId} AND ROWID = ${appointmentId}`;
    const queryResp = await zcql.executeZCQLQuery(query).catch(() => null);
    if (queryResp == null || queryResp.length === 0) {
      throw new Error("Patient not found");
    }
    return queryResp[0];
  },

  updateAppointment: async (capp, hospitalId, appointmentId, updateData) => {
    // console.log("Updating Patient with ID:", appointmentId);
    // console.log("Update data:", updateData);

    const datastore = capp.datastore();
    const table = datastore.table("Appointments");

    // Construct a JSON Object with the updated row details
    let updatedRowData = {
      ROWID: appointmentId,
      ...updateData,
    };

    try {
      // Use Table Meta Object to update a single row using ROWID which returns a promise
      let rowPromise = table.updateRow(updatedRowData);

      // Wait for the update operation to complete
      let updatedRow = await rowPromise;

      // console.log("Row updated successfully:", updatedRow);
      return updatedRow;
    } catch (error) {
      console.error("Failed to update the row:", error);
      throw new Error("Failed to update Appointment");
    }
  },
};

exports.BillsForReceptionist = {
  AddBill: async (capp, hospitalId, receptionistId, data) => {
    const {
      patient_name,
      patient_id,
      hospital_name,
      doctor_name,
      ServiceDetails,
      Amount,
      phone,
      Billing_Date,
      Status,
      PaymentMethod,
      doctor_id,
      date_of_admission,
    } = data;

    const rowData = {
      patient_name,
      patient_id,
      hospital_name,
      hospital_id: hospitalId,
      doctor_name,
      ServiceDetails,
      Amount,
      phone,
      Billing_Date,
      Status,
      PaymentMethod,
      doctor_id,
      date_of_admission,
      receptionist_id: receptionistId,
    };

    try {
      const row = await capp.datastore().table("Bills").insertRow(rowData);
      return row;
    } catch (error) {
      console.error("Failed to create bill:", error);
      throw new Error("Failed to create bill");
    }
  },

  EditBill: async (capp, hospitalId, receptionistId, billId, data) => {
    const rowData = {
      ...data,
      hospital_id: hospitalId,
      receptionist_id: receptionistId,
    };

    try {
      const row = await capp
        .datastore()
        .table("Bills")
        .updateRow(billId, rowData);
      return row;
    } catch (error) {
      console.error("Failed to update bill:", error);
      throw new Error("Failed to update bill");
    }
  },

  DeleteBill: async (capp, billId) => {
    try {
      const result = await capp.datastore().table("Bills").deleteRow(billId);
      return { success: true, message: "Bill deleted successfully" };
    } catch (error) {
      console.error("Failed to delete bill:", error);
      throw new Error("Failed to delete bill");
    }
  },

  all: async (capp, hospitalId, fallback = undefined) => {
    let items = await capp
      .zcql()
      .executeZCQLQuery(
        `SELECT * FROM ${appointments.table_name} WHERE hospital_id = ${hospitalId}`
      )
      .catch(() => null);

    if (items == null || items == undefined) {
      return fallback;
    }
    return items.map((item) => item[appointments.table_name]);
  },
  getDoctor: async (capp, doctor_id, fallback = undefined) => {
    let doctor = await capp
      .zcql()
      .executeZCQLQuery(`SELECT * FROM Doctors WHERE ROWID =${doctor_id}`)
      .catch(() => null);
    console.log(doctor);

    if (doctor == null || doctor == undefined) {
      return fallback;
    }
    return doctor.map((doctor) => doctor["Doctors"]);
  },

  getReceptionst: async (capp, userId, fallback = undefined) => {
    console.log(capp);
    let receptionist = await capp
      .zcql()
      .executeZCQLQuery(`SELECT * FROM Receptionist WHERE user_id = ${userId}`)
      .catch(() => null);

    console.log("here is the receptionist", receptionist);

    if (receptionist == null || receptionist == undefined) {
      return fallback;
    }
    return receptionist.map((item) => item["Receptionist"]);
  },

  getBills: async (capp, id, fallback = undefined) => {
    console.log("Got the id of the user", id);
    let bills = await capp
      .zcql()
      .executeZCQLQuery(`SELECT * FROM Bills WHERE receptionist_id = ${id}`)
      .catch(() => null);

    console.log("All Bills", bills);

    if (bills == null || bills == undefined) {
      return fallback;
    }
    return bills.map((item) => item["Bills"]);
  },
  //Get hospital of that perticular receptionist
  getHospital: async (capp, id, fallback = undefined) => {
    let hospital = await capp
      .zcql()
      .executeZCQLQuery(`SELECT * FROM Hospitals WHERE ROWID =${id}`)
      .catch(() => null);
    console.log(hospital);

    if (hospital == null || hospital == undefined) {
      return fallback;
    }
    return hospital.map((hospital) => hospital["Hospitals"]);
  },
};
