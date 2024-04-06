const appointmentModel = require("../models/appointmentsModel");
const doctorModel = require("../models/doctorModel")
const User = require("../models/user")

const getDoctorInfo = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId })
    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in fetching doctor details"
    })
  }
}

const updateProfile = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue"
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Sigle Doc Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Erro in Single docot info",
    });
  }
};

const doctorAppointments = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    const appointments = await appointmentModel.find({ doctorId: doctor._id });
    res.status(200).send({
      success: true,
      message: "Doctor appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching doctor appointments",
    });
  }
};

const acceptAppointment = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    const user = await User.findOne({ _id: updatedAppointment.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.notification.push({
      type: "status-updated",
      message: `Your appointment has been updated to ${status}`,
      onClickPath: "/doctor-appointments",
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating appointment status",
    });
  }
};

const rejectAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const removedAppointment = await appointmentModel.findByIdAndDelete(appointmentId);
    if (!removedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    const user = await User.findOne({ _id: removedAppointment.userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.notification.push({
      type: "appointment-rejected",
      message: "Your appointment has been rejected",
      onClickPath: "/doctor-appointments",
    });
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Appointment rejected",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in updating appointment status",
    });
  }
};

const completedAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id
    const removedAppointment = await appointmentModel.findByIdAndDelete(appointmentId)
    if(!removedAppointment){
      return res.status(404).send({
        success: false,
        message: "Appointment not found"
      })
    }
    return res.status(200).send({
      success: true,
      message: "Appointment completed and removed"
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "Error in completing appointment"
    })
  }
}

module.exports = {
  getDoctorInfo,
  updateProfile,
  getDoctorById,
  doctorAppointments,
  acceptAppointment,
  rejectAppointment,
  completedAppointment
}