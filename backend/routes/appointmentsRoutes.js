const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const router = express.Router();
const Doctor = require("../models/Doctor");
const User = require("../models/User");

router.post("/book", authMiddleware, async (req, res) => {
    const { doctor, date, time, reason } = req.body;
    try {
        const patient = await Patient.findOne({ user: req.user.id });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        // Find doctor by name
        // const user = await User.findOne({ name: doctorName, role: "doctor" });
        // if (!user) {
        //     return res.status(404).json({ message: "Doctor not found. while user" });
        // }

        console.log(doctor)
        const doctorObject = await Doctor.findById(doctor);
        if (!doctorObject) {
            return res.status(404).json({
                message: "Doctor not found while doctor"
            })
        }

        const newDate = new Date(date);

        const app = new Appointment({
            patient: patient._id,
            doctor: doctor,  // Use doctor._id here
            date: newDate,
            time,
            reason,
            status: "pending"
        });
        await app.save();

        if (!doctorObject.patients.includes(patient._id)) {
            doctorObject.patients.push(patient._id)
            await doctorObject.save();
        }


        res.status(201).json({ message: "Appointment booked successfully", app });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error."+err, err });
    }
});

router.get("/my-appointments", authMiddleware, async (req, res) => {
    try {
        const patient = await Patient.findOne({ user: req.user.id });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }
        const appointments = await Appointment.find({ patient: patient._id })
            .populate({
                path: "doctor",
                select: "name specialization",
                populate: { path: "user", select: "name" }
            })
            .populate({
                path: "patient",
                select: "name",
                populate: { path: "user", select: "name" }
            });
        res.status(200).json(appointments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
})


router.get("/doctor-appointments", authMiddleware, async (req, res) => {
    try {
        // Find doctor associated with the logged-in user
        const doctor = await Doctor.findOne({ user: req.user.id });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found." });
        }

        // Fetch all appointments for this doctor
        const appointments = await Appointment.find({ doctor: doctor._id })
            .populate({
                path: "doctor",
                select: "name specialization",
                populate: { path: "user", select: "name" }
            })
            .populate({
                path: "patient",
                select: "name",
                populate: { path: "user", select: "name" }
            });
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

router.put("/update-status/:appointmentId", authMiddleware, async (req, res) => {
    const { appointmentId } = req.params;
    const { status } = req.body;

    try {
        const doctor = await Doctor.findOne({ user: req.user.id });
        if (!doctor) {
            return res.status(403).json({
                message: "Only doctors can update the status."
            })
        }

        const app = await Appointment.findById(appointmentId);
        if (!app) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        if (app.doctor.toString() !== doctor._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this appointment." });
        }

        app.status = status;
        await app.save();
        res.status(200).json({ message: "Appointment status updated successfully.", app });
    }
    catch (error) {
        // console.error(error);
        res.status(500).json({ message: "Server error.", error });
    }
})

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate({
                path: "doctor",
                select: "name specialization",
                populate: { path: "user", select: "name" }
            })
            .populate({
                path: "patient",
                select: "name",
                populate: { path: "user", select: "name" }
            });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }
       
        if (appointment.patient.user._id.toString() !== req.user.id && appointment.doctor._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to cancel this appointment." });
        }

        // Delete the appointment
        await Appointment.findByIdAndDelete(req.params.id);


        res.status(200).json({ message: "Appointment cancelled successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});


router.get("/:appointmentId", authMiddleware, async (req, res) => {
    const { appointmentId } = req.params;

    try {
        // Find the appointment by ID and populate doctor and patient details
        const appointment = await Appointment.findById(appointmentId)
            .populate({
                path: "doctor",
                select: "name specialization",
                populate: { path: "user", select: "name" }
            })
            .populate({
                path: "patient",
                select: "name",
                populate: { path: "user", select: "name" }
            });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        if (appointment.patient.user._id.toString() !== req.user.id.toString() && appointment.doctor._id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "You are not authorized to view this appointment." });
        }
        res.status(200).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;