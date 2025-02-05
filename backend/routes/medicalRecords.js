const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const MedicalRecord = require("../models/MedicalRecord");
const router = express.Router();


router.post("/create", authMiddleware, async (req, res) => {
    const { patientId, diagnosis, treatment, notes } = req.body;

    try {
        const doctor = await Doctor.findOne({ user: req.user.id });
        if (!doctor) {
            return res.status(403).json({ message: "Only doctors can create medical records." });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        const newRecord = new MedicalRecord({
            patient: patient._id,
            doctor: doctor._id,
            diagnosis,
            treatment,
            notes,
        });

        await newRecord.save();

        res.status(201).json({ message: "Medical record created successfully.", record: newRecord });
    } catch (error) {
        res.status(400).json({ message: "Server error" + error, error });
    }
});

router.get("/patient/:patientId", authMiddleware, async (req, res) => {
    const { patientId } = req.params;

    try {
        const patient = await Patient.findOne({ user: req.user.id });
        if (!patient || patient._id.toString() !== patientId) {
            return res.status(403).json({ message: "You are not authorized to view these records." });
        }

        const records = await MedicalRecord.find({ patient: patientId })
            .populate("doctor", "specialization")
            .populate("patient", "user");

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
});

router.get("/doctor", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user.id });
        if (!doctor) {
            return res.status(403).json({ message: "Only doctors can access this route." });
        }

        const records = await MedicalRecord.find({ doctor: doctor._id })
        .populate({
            path: "patient",
            select: "name",
            populate: {path: "user", select: "name"}
        })
        .populate({
            path: "doctor",
            select: "name",
            populate: {path: "user", select: "name"}
        })

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
});

router.put("/update/:recordId", authMiddleware, async (req, res) => {
    const { recordId } = req.params;
    const { diagnosis, treatment, notes } = req.body;

    try {
        const doctor = await Doctor.findOne({ user: req.user.id });
        if (!doctor) {
            return res.status(403).json({ message: "Only doctors can update medical records." });
        }

        const record = await MedicalRecord.findById(recordId);
        if (!record || record.doctor.toString() !== doctor._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this record." });
        }

        if (diagnosis) record.diagnosis = diagnosis;
        if (treatment) record.treatment = treatment;
        if (notes) record.notes = notes;

        await record.save();

        res.status(200).json({ message: "Medical record updated successfully.", record });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
});

router.delete("/delete/:recordId", authMiddleware, async (req, res) => {
    const { recordId } = req.params;

    try {
        const doctor = await Doctor.findOne({ user: req.user.id });
        if (!doctor) {
            return res.status(403).json({ message: "Only doctors can delete medical records." });
        }

        const record = await MedicalRecord.findById(recordId);
        if (!record || record.doctor.toString() !== doctor._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this record." });
        }

        await MedicalRecord.findByIdAndDelete(req.params.recordId);

        res.status(200).json({ message: "Medical record deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error."+error, error });
    }
});



module.exports = router;