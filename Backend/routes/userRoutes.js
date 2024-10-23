const express = require("express");
const {
  loginController,
  registerController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentController
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const { authController } = require("../controllers/userCtrl");

//router object
const router = express.Router();

//login routes
router.post("/login", loginController);

//Register || post
router.post("/register", registerController);

//Auth || post
router.post("/getUserData", authMiddleware, authController);

//apply Doctor || post
router.post("/apply-doctor", authMiddleware, applyDoctorController);

// Notification Doctor || post
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

// Notification Doctor || post
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

// Get all doc
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController)

//Book Appointment
router.post('/book-appointment', authMiddleware, bookAppointmentController)

//booking availibillity
router.post("/booking-availability", authMiddleware, bookingAvailabilityController)

//Appointments List
router.get('/user-appointments', authMiddleware, userAppointmentController)

module.exports = router;
