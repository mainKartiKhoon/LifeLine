const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true},
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true},
    date: {type: Date, required: true},
    time: {type: String, required: true},
    reason: {type: String},
    status: {type: String, enum: ["pending", "confirmed", "completed", "cancelled"]},
})

module.exports = mongoose.model("Appointment", appointmentSchema);