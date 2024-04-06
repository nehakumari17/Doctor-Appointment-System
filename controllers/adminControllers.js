const doctorModel = require("../models/doctorModel")
const User = require("../models/user")

const getAllUsers = async (req, res) => {
    try{
        const users = await User.find({})
        res.status(200).send({
            success: true,
            message: "Users data list",
            data: users
        })
    } catch(error){
        concole.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting users data"
        })
    }
}

const getAllDoctors = async (req, res) => {
    try{
        const doctors = await doctorModel.find({})
        res.status(200).send({
            success: true,
            message: "Doctors data list",
            data: doctors
        })
    } catch(error){
        concole.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting doctors data"
        })
    }
}

 const acceptApplication = async (req, res) => {
    try {
      const { doctorId, status } = req.body;
      const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
      const user = await User.findOne({ _id: doctor.userId });
      const notification = user.notification;
      notification.push({
        type: "doctor-account-request-updated",
        message: `Your Doctor Account Request Has ${status} `,
        onClickPath: "/notification",
      });
      user.isDoctor = status === "approved" ? true : false;
      await user.save();
      res.status(201).send({
        success: true,
        message: "Account Status Updated",
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror in Account Status",
        error,
      });
    }
  };

  const rejectApplication = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const status = req.params.status;
        const doctor = await doctorModel.findByIdAndDelete(doctorId);
        
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: "Doctor not found"
            });
        }
        
        const user = await User.findOne({ _id: doctor.userId });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        const notification = user.notification;
        notification.push({
            type: "doctor-account-request-rejected",
            message: `Your Doctor Account Request Has been ${status} `,
            onClickPath: "/notification",
        });
        await user.save();
        res.status(201).send({
            success: true,
            message: "Doctor Request Rejected",
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Rejecting Doctor Request",
            error,
        });
    }
}
 
    const removeDoctor = async (req, res) => {
        try {
            const doctorId = req.params.id
            const removedDoctor = await doctorModel.findByIdAndDelete(doctorId)
            if(!removedDoctor){
                res.status(404).send({
                    success: false,
                    message: "Doctor not found"
                })
            }
            res.status(200). send({
                success: true,
                message: "Doctor removed successfully"
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success: false,
                message: "Error in removing doctor"
            })
        }
    }

   const removeUser = async (req, res) => {
    try {
      const  userId  = req.params.id;
      const removedUser = await User.findByIdAndDelete(userId);
      if (!removedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, message: 'User removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

module.exports = {
    getAllUsers,
    getAllDoctors,
    acceptApplication,
    rejectApplication,
    removeDoctor,
    removeUser
}