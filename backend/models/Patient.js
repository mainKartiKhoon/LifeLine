const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    name: {type: String},
    age: {type: Number, required: true},
    gender: {type: String, enum: ["male", "female", "other"], required: true},
    address: {type: String},
    medicalHistory: {type: Array, default: []},
    currentMedications: {type: Array, default: []},
    emergencyContact: {
        name: {type: String},
        phone: {type: String},
    },
})

module.exports = mongoose.model("Patient", patientSchema);