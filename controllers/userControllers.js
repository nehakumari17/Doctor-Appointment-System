require('dotenv').config()
const User = require("../models/user")
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken")
const doctorModel = require("../models/doctorModel")
const appointmentModel = require("../models/appointmentsModel")
const moment = require("moment")

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists with this email" });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({ name, email, password: hashPassword });
        await newUser.save();
        
        res.status(200).send({ msg: "Sign up successful" });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).send({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })

        if(!user){
            return res.status(400).json({message: "Please register yourself first!!", success: false})
        }
        const isCorrectPassword = bcrypt.compareSync(password, user.password)

        if(!isCorrectPassword){
            return res.status(400).send({message: "Invalid Email or Password."})
        }
        else{
            const token = JWT.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
            res.status(200).send({ message: "Login Successful", success: true, token });
        }
    } catch (error) {
        res.status(500).send({message: "An error occured"})
    }
}


const getUser = async (req, res) => {
    try {
        if (!req.body.userId) {
            return res.status(400).send({
                message: "User ID is missing in the request body",
                success: false
            });
        }
      const user = await User.findById({ _id: req.body.userId });
      user.password = undefined;
      if (!user) {
        return res.status(500).send({
          message: "user not found",
          success: false,
        });
      } else {
        res.status(200).send({
          success: true,
          data: user
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "auth error",
        success: false,
        error,
      });
    }
  };

  const applyDoctor = async (req, res) => {
    try {
      const doctor = await doctorModel({ ...req.body, status: 'pending' })
      await doctor.save()
      const adminUser = await User.findOne({ isAdmin: true })
      console.log(adminUser);
      const notification = adminUser.notification
      notification.push({
        type: 'apply-doctor-request',
        message: `${ doctor.firstName } ${ doctor.lastName } has applied for a Doctor Account`,
        data: {
          doctorId: doctor._id,
          name: doctor.firstName + " " + doctor.lastName,
          onClickPath: '/admin/doctors'
        }
      })
      await User.findByIdAndUpdate(adminUser._id, { notification })
      res.status(201).send({
        success: true,
        message: "Doctor account applied successfully"
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while applying for doctor"
      })
    }
  }

  const getAllNotification = async (req, res) => {
    try {
      const user = await User.findOne({ _id:req.body.userId })
      const seenNotification = user.seenNotification
      const notification = user.notification
      seenNotification.push(...notification)
      user.notification = []
      user.seenNotification = notification
      const updatedUser = await user.save()
      res.status(200).send({
        success: true,
        message: "all notification marked as read",
        data: updatedUser
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        message: "Error in notification",
        success: false,
      })
    }
  }

  const deleteAllNotification = async (req, res) => {
    try {
      const user = await User.findOne({ _id:req.body.userId })
      user.notification = []
      user.seenNotification = []
      const updatedUser = await user.save()
      updatedUser.password = undefined
      res.status(200).send({
        success: true,
        message: "Notifications deleted successfully",
        data: updatedUser
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        success: false,
        message: "Unable to delete all notifications"
      })
    }
  }

  const getAllDoctors = async (req, res) => {
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
        message: "Error WHile Fetching Doctor",
      });
    }
  };

  const bookAppointment = async (req, res) => {
    try {
      req.body.date = moment(req.body.date, "DD-MM-YYYY").format("DD-MM-YYYY");
      req.body.time = moment(req.body.time, "HH:mm").format("HH:MM");
      req.body.status = "pending";
      const newAppointment = new appointmentModel(req.body);
      await newAppointment.save();
      const user = await User.findOne({ _id: req.body.doctorInfo.userId });
      user.notification.push({
        type: "New-appointment-request",
        message: `A new appointment request from ${req.body.userInfo.name}`,
        onCLickPath: "/user/appointments",
      });
      await user.save();
      res.status(200).send({
        success: true,
        message: "Appointment Book succesfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error While Booking Appointment",
      });
    }
  }

  const bookingAvailability = async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YY");
        const time = moment(req.body.time, "HH:mm");
        const doctorId = req.body.doctorId;
        const doctor = await doctorModel.findById(doctorId);
        const workingHoursStart = moment(doctor.timings.startTime, "HH:mm");
        const workingHoursEnd = moment(doctor.timings.endTime, "HH:mm");
        
        if (time.isBefore(workingHoursStart) || time.isSameOrAfter(workingHoursEnd)) {
            return res.status(200).send({
                message: "Doctor is not available at that time",
                success: false
            });
        }
        const endTime = moment(time).add(1, 'hour'); 
        const appointments = await appointmentModel.find({
            doctorId,
            date,
            time: { $gte: time, $lt: endTime }
        });

        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Appointments not available at that time",
                success: true
            });
        } else {
            return res.status(200).send({
                message: "Appointments available",
                success: true
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in booking",
        });
    }
};

  const userAppointments = async (req, res) => {
    try {
      const appointments = await appointmentModel.find({
        userId: req.body.userId,
      });
      res.status(200).send({
        success: true,
        message: "Users Appointments Fetch SUccessfully",
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In User Appointments",
      });
    }
  }

module.exports = {
  login, 
  register, 
  getUser, 
  applyDoctor, 
  getAllNotification,
  deleteAllNotification,
  getAllDoctors,
  bookAppointment,
  bookingAvailability,
  userAppointments
}