const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    name: {type: String},
    gender: {type: String, enum: ["male", "female", "other"]},
    specialization: {type: String, required: true},
    experience: {type: Number},
    availability: {
        days: {type: Array, default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]},
        time: { type: String, default: "9:00 AM - 5:00 PM" },
    },
    patients: [{type: mongoose.Schema.Types.ObjectId, ref: "Patient"}],
})

module.exports = mongoose.model("Doctor", doctorSchema);