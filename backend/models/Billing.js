const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    amount: { type: Number, required: true },
    dateIssued: { type: Date, default: Date.now },
    dueDate: { type: Date },
    status: { type: String, enum: ["paid", "pending", "overdue"], default: "pending" },
});

module.exports = mongoose.model("Billing", billingSchema);
