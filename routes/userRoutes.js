const router = require("express").Router()
const {login, register, getUser, applyDoctor, getAllNotification, deleteAllNotification, getAllDoctors, userAppointments, bookingAvailability, bookAppointment} = require("../controllers/userControllers")
const authMiddleware = require("../middlewares/authMiddleware")

router.route("/login").post(login)

router.route("/register").post(register)

router.route("/getUser").post(authMiddleware ,getUser)

router.route("/apply-doctor").post(authMiddleware ,applyDoctor)

router.route("/get-all-notification").post(authMiddleware , getAllNotification)

router.route("/delete-all-notification").post(authMiddleware , deleteAllNotification)

router.route("/getAllDoctors").get(authMiddleware , getAllDoctors)

router.route("/book-appointment").post(authMiddleware , bookAppointment)

router.route("/booking-availability").post(authMiddleware , bookingAvailability)

router.route("/user-appointments").get(authMiddleware , userAppointments)

module.exports = router