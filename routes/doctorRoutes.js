const router = require("express").Router()

const authMiddleware = require("../middlewares/authMiddleware")
const {getDoctorInfo, updateProfile, getDoctorById, doctorAppointments, acceptAppointment, rejectAppointment, completedAppointment} = require("../controllers/doctorControllers")

router.route("/getDoctorInfo").post(authMiddleware, getDoctorInfo)

router.route("/updateProfile").post(authMiddleware, updateProfile)

router.route("/getDoctorById").post(authMiddleware, getDoctorById);

router.route("/doctor-appointments").get(authMiddleware, doctorAppointments);

router.route("/acceptAppointment").post(authMiddleware, acceptAppointment);

router.route("/rejectAppointment/:id").delete(authMiddleware, rejectAppointment)

router.route("/completedAppointment/:id").delete(authMiddleware, completedAppointment)

module.exports = router