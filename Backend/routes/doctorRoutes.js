const express = require("express");
const {
  getDoctorInfoController,
  updateProfileController,
  getDcotorbyIdController,
  doctorAppointmentController,
  updateStatusController,
} = require("../controllers/doctorCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//post single doc info

router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//post update profile
router.post("/updateProfile", authMiddleware, updateProfileController);

//POST GET SINGLE DOC INFO
router.post("/getDoctorById", authMiddleware, getDcotorbyIdController);

//get Appointments
router.get("/doctor-appointments", authMiddleware, doctorAppointmentController);

//post update status
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;
