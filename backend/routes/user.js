const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Admin = require("../models/Admin");
const Doctor = require("../models/Doctor");
const { JWT_SECRET } = require("../config");
const authMiddleware = require("../middlewares/auth");

router.post("/register", async (req, res) => {
    const { name, email, password, role, age, gender, phone, address, specialization, availability, experience } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered!"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name, email, password: hashedPassword, role, phone,
        })
        await user.save();
        if (role === "patient") {
            const patient = new Patient({
                user: user._id,
                name,
                age,
                gender,
                address,
                medicalHistory: [],
                currentMedications: []
            });
            await patient.save();
        }
        else if (role === "doctor") {
            const doctor = new Doctor({
                user: user._id,
                name,
                gender,
                specialization,
                experience,
                availability: availability || {
                    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    time: "9:00 AM - 5:00 PM",
                },
            })
            await doctor.save();
        }
        else if (role === "admin") {
            const admin = new Admin({
                user: user._id,
                name
            });
            await admin.save();
        }
        else {
            return res.status(400).json({ message: "Invalid role provided." });
        }
        return res.status(200).json({
            message: "User registered!"
        })
    }
    catch (err) {
        res.status(500).json({
            message: "Error in user registration", err

        })
    }
})


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);

        res.status(200).json({
            message: "Login successful.",
            token,
            role: user.role,
        });



    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
})

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
})

router.get("/doctors/details", async (req, res) => {
    try {
        // Fetch all doctors and populate the user field
        const doctors = await Doctor.find().populate("user", "name email phone role");

        // Return the array of doctor objects with user information populated
        res.status(200).json({
            success: true,
            data: doctors,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve doctor details",
            error: error.message,
        });
    }
});

router.delete("/doctors/:doctorId", authMiddleware, async (req, res) => {
    try {
        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized. Admin access required." });
        }

        // Find the doctor by their ID
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found." });
        }

        // Delete the associated user
        await User.findByIdAndDelete(doctor.user);

        // Delete the doctor
        await Doctor.findByIdAndDelete(req.params.doctorId);

        res.status(200).json({ message: "Doctor and associated user deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", error });
    }
});

router.get("/doctor/patients", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user.id }).populate('patients');
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found." });
        }
        // Return the patients of the doctor
        res.status(200).json({
            success: true,
            patients: doctor.patients, // This will give you an array of patient objects
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve patients",
            error: error.message,
        });
    }
})



module.exports = router;