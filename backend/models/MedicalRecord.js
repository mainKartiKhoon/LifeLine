const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment", // Reference to the Appointment model
        required: true,     // Assuming a medical record always relates to an appointment
    },
    diagnosis: {
        type: String,
        required: true,
    },
    treatment: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
