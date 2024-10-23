const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.send({
        status: 200,
        message: "User already Exist",
        success: false,
      });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    req.body.password = hashPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.send({
      status: 200,
      message: "Register successfull",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 500,
      message: `Register Controller${error.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      return res.send({
        status: 200,
        message: "User Not found",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.send({
        status: 200,
        message: "Invalid email and Password",
        success: false,
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.send({
      status: 200,
      message: "Login Success",
      success: true,
      token,
    });
  } catch (error) {
    res.send({
      status: 500,
      message: `Error in Login CTRL ${error.message}`,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.send({
        status: 200,
        message: "User Not Found",
        success: false,
      });
    } else {
      res.send({
        status: 200,
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: 500,
      message: "Auth Error",
      success: false,
      error,
    });
  }
};

const applyDoctorController = async (req, res) => {
  console.log("applyDoctorController", req.body);
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    console.log("newDoctor", newDoctor);
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    console.log("admin User >> ", adminUser);
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.send({
      status: 201,
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying For Doctor",
    });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notification Deleted Successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to delete all notification",
      error,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching Doctor",
    });
  }
};

//Book Appointment controller
const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while booking appointment",
    });
  }
};

//booking availability ctrl
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").format("DD-MM-YYYY");
    const time = moment(req.body.time, "HH:mm");

    const fromTime = moment(`${req.body.date} ${req.body.time}`, "DD-MM-YYYY HH:mm")
    .subtract(1, "hours")
    .toISOString();
  
  const toTime = moment(`${req.body.date} ${req.body.time}`, "DD-MM-YYYY HH:mm")
    .add(1, "hours")
    .toISOString();

    // const fromTime = moment(req.body.time, "HH:mm")
    //   .subtract(1, "hours")
    //   .toISOString();
    // const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Available at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointment Available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};


//user Appointment ctrl
const userAppointmentController = async (req, res)=>{
  try {
    const appointments = await appointmentModel.find({userId:req.body.userId})
    res.status(200).send({
      success: true,
      message: 'Users Appointment Fetch Successfully',
      data: appointments
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: 'Error in User Appointments'
    })
  }
}

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentController,
};
