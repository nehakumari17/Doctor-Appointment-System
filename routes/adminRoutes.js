const router = require("express").Router()
const { getAllUsers, getAllDoctors, acceptApplication, rejectApplication, removeDoctor, removeUser } = require("../controllers/adminControllers")
const authMiddleware = require("../middlewares/authMiddleware")

router.route("/getAllUsers").get(authMiddleware, getAllUsers)

router.route("/getAllDoctors").get(authMiddleware, getAllDoctors)

router.route("/acceptApplication").post(authMiddleware, acceptApplication)

router.route("/rejectApplication/:id/:status").delete(authMiddleware, rejectApplication)

router.route("/removeDoctor/:id").delete(authMiddleware, removeDoctor)

router.route("/removeUser/:id").delete(authMiddleware, removeUser)

module.exports = router