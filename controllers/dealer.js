
exports.getPatientFromHospital = {
  // Get all patient fromn particular hospital
  all: async (capp, doctorId, fallback = undefined) => {
    let items = await capp
      .zcql()
      .executeZCQLQuery(`SELECT * FROM Patients WHERE doctor_id = ${doctorId}`)
      .catch(() => null);

    if (items == null || items == undefined) {
      return fallback;
    }
    const data = items.map((item) => item.Patients);
    // console.log("Doctor Data",data);
    return items.map((item) => item[patients.table_name]);
  },

  //Get particular Paitent from hospital
  patient: async (capp, doctorId, patientId) => {
    const zcql = capp.zcql();
    const query = `SELECT * FROM ${patients.table_name} WHERE doctor_id = ${doctorId} AND ROWID = ${patientId}`;
    const queryResp = await zcql.executeZCQLQuery(query).catch(() => null);
    if (queryResp == null || queryResp.length === 0) {
      throw new Error("Patient not found");
    }
    return queryResp[0];
  },
  updatePatient: async (capp, doctorId, patientId, updateData) => {
    console.log("Updating Patient with ID:", patientId);
    console.log("Update data:", updateData);

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
};

exports.getAppointmentsFromHospitals = {
  all: async (capp, doctorId, fallback = undefined) => {
    let items = await capp
      .zcql()
      .executeZCQLQuery(
        `SELECT * FROM Appointments WHERE doctor_id = ${doctorId}`
      )
      .catch(() => null);

    if (items == null || items == undefined) {
      return fallback;
    }
    // console.log("Here is the appointment data",items);
    return items.map((item) => item.Appointments);
  },

  //Get particular appointment from hospital
  appointment: async (capp, doctorId, appointmentId) => {
    const zcql = capp.zcql();
    const query = `SELECT * FROM ${appointments.table_name} WHERE doctor_id = ${doctorId} AND ROWID = ${appointmentId}`;
    const queryResp = await zcql.executeZCQLQuery(query).catch(() => null);
    if (queryResp == null || queryResp.length === 0) {
      throw new Error("Patient not found");
    }
    return queryResp[0];
  },

  updateAppointment: async (capp, appointmentId, updateData) => {
    const datastore = capp.datastore();
    const table = datastore.table("Appointments");
    //   console.log("table acess",table);

    // Construct a JSON Object with the updated row details
    let UpdatedAptrowData = {
      ROWID: appointmentId,
      ...updateData,
    };

    console.log(
      "Here is the appointment data we got from the frontend client",
      UpdatedAptrowData
    );
    //   console.log("here is the row data",UpdatedAptrowData);
    try {
      // Use Table Meta Object to update a single row using ROWID which returns a promise
      let rowPromise = table.updateRow(UpdatedAptrowData);

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

exports.patientHistory = {
  // Get all treatment history
  all: async (capp, fallback = undefined) => {
    let history = await capp
      .zcql()
      .executeZCQLQuery(`SELECT * FROM Treatements`)
      .catch(() => null);

    if (history == null || history == undefined) {
      return fallback;
    }
    return history.map((history) => history["Treatements"]);
  },

  // Get history of a particular patient
  getPatientHistory: async (capp, patientId, fallback = undefined) => {
    let history = await capp
      .zcql()
      .executeZCQLQuery(
        `SELECT * FROM Treatements WHERE patient_id = ${patientId}`
      )
      .catch(() => null);

    if (history == null || history == undefined) {
      return fallback;
    }
    return history.map((history) => history["Treatements"]);
  },

  // Add treatment to a patient
  AddTreatement: async (capp, patientId, data) => {
    console.log(data);
    const { doctorName, hospitalName, treatmentDetails } = data;

    const rowData = {
      patient_id: patientId,
      doctor_name: doctorName,
      hospital_name: hospitalName,
      treatement_details: treatmentDetails,
    };

    console.log("Row Data", rowData);

    try {
      const row = await capp
        .datastore()
        .table("Treatements")
        .insertRow(rowData);
      return row;
    } catch (error) {
      console.error("Failed to add treatment:", error);
      throw new Error("Failed to add treatment");
    }
  },

  // Edit a treatment record
  EditTreatement: async (capp, doctorId, patientId, treatmentId, data) => {
    const rowData = {
      ...data,
      patient_id: patientId,
      doctor_id: doctorId,
    };

    try {
      const row = await capp
        .datastore()
        .table("Treatements")
        .updateRow(treatmentId, rowData);
      return row;
    } catch (error) {
      console.error("Failed to update treatment:", error);
      throw new Error("Failed to update treatment");
    }
  },

  // Delete a treatment record
  DeleteTreatement: async (capp, doctorId, patientId, treatmentId) => {
    try {
      const result = await capp
        .datastore()
        .table("Treatements")
        .deleteRow(treatmentId);
      return { success: true, message: "Treatment deleted successfully" };
    } catch (error) {
      console.error("Failed to delete treatment:", error);
      throw new Error("Failed to delete treatment");
    }
  },

  AllTreatements: async (capp, name, fallback = undefined) => {
    console.log("Name in the backend controller function", name);
    let history = await capp
      .zcql()
      .executeZCQLQuery(
        `SELECT *FROM Treatements WHERE doctor_name = '${name}'`
      )
      .catch(() => null);

    console.log("History", history);

    if (history == null || history == undefined) {
      return fallback;
    }
    return history.map((history) => history["Treatements"]);
  },
};

//controllers for the dashboards apis

exports.dashboardData = {
  GetAppointmenttCount: async (capp, doctorId) => {
    console.log("data", doctorId);

    let count = await capp
      .zcql()
      .executeZCQLQuery(
        `SELECT COUNT(ROWID) FROM Appointments WHERE doctor_id = '${doctorId}';`
      )
      .catch(() => null);

    console.log(count);

    if (count == null || count == undefined) {
      return fallback;
    }

    const total = count.map((count) => count["Appointments"].ROWID);

    return total[0];
  },

  getTreatements: async (capp, fallback = undefined) => {
    let treatement = await capp
      .zcql()
      .executeZCQLQuery(`SELECT * FROM Services`)
      .catch(() => null);

    if (treatement == null || treatement == undefined) {
      return fallback;
    }

    // console.log("history", treatement);
    return treatement.map((treatement) => treatement["Services"]);
  },

  getMedicines: async (capp, fallback = undefined) => {
    let medicines = await capp
      .zcql()
      .executeZCQLQuery(`SELECT * FROM Medicines`)
      .catch(() => null);

    if (medicines == null || medicines == undefined) {
      return fallback;
    }

    // console.log("medicines", medicines);
    return medicines.map((medicines) => medicines["Medicines"]);
  },
};

// adding updating and deleting services/Treatements and medicines
exports.ServicesMedicines = {
  AddServices: async (capp, data) => {
    // Check if data is an array and contains multiple services
    let serviceData = [];
    if (!Array.isArray(data)) {
      // If data is not an array, convert it to an array containing a single object
      serviceData = [data];
    } else {
      serviceData = data;
    }

    // Prepare an array of rows to insert
    const rowsToInsert = serviceData.map((service) => {
      const { Category, ServiceName, description, Cost } = service;

      return {
        ServiceName,
        Category,
        description,
        Cost,
      };
    });

    try {
      // Insert each row into the table
      const insertedRows = await Promise.all(
        rowsToInsert.map(async (rowData) => {
          return await capp.datastore().table("Services").insertRow(rowData);
        })
      );
      console.log("Here are the inserted rows", insertedRows);

      // If successful, return 200 with a success message and inserted rows
      return {
        status: 200,
        message: "Services created successfully",
        data: insertedRows,
      };
    } catch (error) {
      console.error("Failed to add services:", error);

      // If an error occurs, return 500 with an error message
      return {
        status: 500,
        message: "Failed to add services",
        error: error.message,
      };
    }
  },

  // Add multiple medicines
  AddMedicines: async (capp, data) => {
    // Check if data is an array or a single object
    if (!Array.isArray(data)) {
      // If it's a single object, convert it to an array with one item
      if (typeof data === "object" && data !== null) {
        data = [data];
      } else {
        throw new Error("Invalid medicines data format");
      }
    }

    // Ensure data is now an array
    if (data.length === 0) {
      throw new Error("Empty medicines data");
    }

    // Log the data for debugging
    console.log(data);

    // Prepare an array of rows to insert
    const rowsToInsert = data.map((medicine) => {
      const { Category, medicine_name, Description } = medicine;

      return {
        medicine_name,
        Category,
        Description,
      };
    });

    // Access datastore
    const datastore = capp.datastore();
    const table = datastore.table("Medicines");

    try {
      // Insert multiple rows in a single operation
      const rows = await table.insertRows(rowsToInsert);

      // Log the inserted rows for debugging
      console.log("Inserted Rows: ", rows);

      // Return success status and message
      return {
        status: 200,
        message: "Medicines added successfully",
        data: rows,
      };
    } catch (error) {
      console.error("Failed to add medicines:", error);
      throw new Error("Failed to add medicines");
    }
  },
  //getting all treatement types
  getTreatements: async (capp, fallback = undefined) => {
    let treatement = await capp
      .zcql()
      .executeZCQLQuery(`SELECT * FROM Services`)
      .catch(() => null);

    if (treatement == null || treatement == undefined) {
      return fallback;
    }

    // console.log("history", treatement);
    return treatement.map((treatement) => treatement["Services"]);
  },

  getMedicines: async (capp, fallback = undefined) => {
    let medicines = await capp
      .zcql()
      .executeZCQLQuery(`SELECT * FROM Medicines`)
      .catch(() => null);

    if (medicines == null || medicines == undefined) {
      return fallback;
    }

    // console.log("medicines", medicines);
    return medicines.map((medicines) => medicines["Medicines"]);
  },

  // Edit a treatement/service
  updateTreatment: async (capp, treatmentId, updatedData) => {
    console.log("Updated data", updatedData);
    const rowData = {
      ROWID: treatmentId,
      ...updatedData,
    };
    try {
      const row = await capp.datastore().table("Services").updateRow(rowData); // Pass updatedData directly
      console.log(row);
      return row;
    } catch (error) {
      console.error("Failed to update treatment/service:", error);
      throw new Error("Failed to update treatment/service");
    }
  },

  //Updating the medicine record
  updateMedicine: async (capp, medicineId, updatedData) => {
    console.log("Updated data", updatedData);
    const rowData = {
      ROWID: medicineId,
      ...updatedData,
    };
    try {
      const row = await capp.datastore().table("Medicines").updateRow(rowData); // Pass updatedData directly
      console.log(row);
      return row;
    } catch (error) {
      console.error("Failed to update Medicines:", error);
      throw new Error("Failed to update Medicines");
    }
  },

  //Deleting service/treatement
  DeleteService: async (capp, treatmentId) => {
    try {
      const result = await capp
        .datastore()
        .table("Services")
        .deleteRow(treatmentId);
      return { success: true, message: "Treatment deleted successfully" };
    } catch (error) {
      console.error("Failed to delete treatment:", error);
      throw new Error("Failed to delete treatment");
    }
  },

  //Delete Medicine

  DeleteMedicine: async (capp, medicineId) => {
    console.log("Medicine Id", medicineId);
    try {
      const result = await capp
        .datastore()
        .table("Medicines")
        .deleteRow(medicineId);
      return { success: true, message: "Medicine deleted successfully" };
    } catch (error) {
      console.error("Failed to delete Medicine:", error);
      throw new Error("Failed to delete Medicine");
    }
  },
  //Get all bills related to that doctor
  GetAllBills: async (capp,id,fallback = undefined) => {
    let bills = await capp
      .zcql()
      .executeZCQLQuery(`SELECT * FROM Bills WHERE doctor_id = ${id}`)
      .catch(() => null);

    if (bills == null || bills == undefined) {
      return fallback;
    }

    // console.log("medicines", medicines);
    return bills.map((bills) => bills["Bills"]);
  },
};
