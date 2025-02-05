const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const appointmentRouter = require("./appointmentsRoutes");
const medicalRecordRoute = require("./medicalRecords");
const inventoryRoute = require("./inventoryRoutes");

router.use("/user", userRouter);
router.use("/appointment", appointmentRouter);
router.use("/inventory", inventoryRoute);
router.use("/record", medicalRecordRoute);

module.exports = router;