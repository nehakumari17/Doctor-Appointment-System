import React, { useEffect, useState } from 'react';
import DocApp from '../DocApp';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

function ApplyDoctor() {

  const { user } = useSelector(state => state.user)

  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const getDoctors = async () => {
      try{
        const res = await axios.get(`${window.location.origin}/api/admin/getAllDoctors`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        if(res.data.success){
          setDoctors(res.data.data)
          // window.location.reload()
        }
      } catch(error){
        console.log(error)
        toast.error("Something went wrong!!")
      }
    }

    getDoctors();
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    specialization: '',
    experience: '',
    feesPerConsultation: '',
    timings: {
      startTime: "",
      endTime: ""
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "startTime" || name === "endTime") {
      setFormData({
        ...formData,
        timings: {
          ...formData.timings,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const existingDoctorApplication = doctors.find(doctor => doctor.userId === user._id && doctor.status === 'pending');
      if (existingDoctorApplication) {
        toast.error("You have already applied for the doctor profile and your status is pending");
        return;
      }
      const { startTime, endTime } = formData.timings;
      const res = await axios.post(
        `${window.location.origin}/api/apply-doctor`,
        { ...formData,
          userId: user._id,
          timings: { startTime, endTime }, },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
  
      if (res.data.success) {
        toast.success("Applied Successfully!!");
        navigate("/home");
      } else {
        console.log(res.data.message);
        toast.error("Not able to apply the doctor profile");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!!");
    }
  };
  

  return (
    <DocApp>
      <Toaster />
      <h1 className="text-center text-4xl">Apply Doctor</h1>
      <form onSubmit={handleSubmit}>
        <h4 className="text-2xl px-4 mt-4 font-medium">Personal Details:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="m-4">
            <label className="block text-black px-2 text-lg">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="rounded-lg p-2 w-full border-2 mt-1 shadow-xl focus:outline-none focus:border-blue-400"
            />

            <label className="block text-black px-2 mt-6 text-lg">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="rounded-lg p-2 w-full border-2 mt-1 shadow-xl focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="m-4">
            <label className="block text-black px-2 text-lg">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="rounded-lg p-2 w-full border-2 mt-1 shadow-xl focus:outline-none focus:border-blue-400"
            />

            <label className="block text-black px-2 mt-6 text-lg">
              Address<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="rounded-lg p-2 w-full border-2 mt-1 shadow-xl focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="m-4">
            <label className="block text-black px-2 text-lg">
              Phone<span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="rounded-lg p-2 w-full border-2 mt-1 shadow-xl focus:outline-none focus:border-blue-400"
            />

            <label className="block text-black px-2 mt-6 text-lg">
              Website
            </label>
            <input
              type="url"
              name="website"
              placeholder="Website"
              value={formData.website}
              onChange={handleInputChange}
              className="rounded-lg p-2 w-full border-2 mt-1 shadow-xl focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <h4 className="text-2xl px-4 mt-5 font-medium">
          Professional Details:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="m-4">
            <label className="block text-black px-2 text-lg">
              Specialization<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              required
              className="rounded-lg p-2 w-full border-2 mt-1 shadow-xl focus:outline-none focus:border-blue-400"
            />
            <label className="block text-black px-2 mt-6 text-lg">Start Time<span className="text-red-500">*</span></label>
            <input
              type="time"
              name="startTime"
              placeholder="Start Time (hh:mm)"
              value={formData.timings.startTime}
              onChange={handleInputChange}
              pattern="([00]?[0-9]|2[0-3]):[0-5][0-9]"
              title="Enter start time in the format hh:mm"
              required
              className="rounded-lg p-2 w-full border-2 mt-1 shadow-xl focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="m-4">
            <label className="block text-black px-2 text-lg">
              Experience<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="experience"
              placeholder="Experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
              className="rounded-lg p-2 w-full border-2 mt-1 shadow-xl focus:outline-none focus:border-blue-400"
            />

            <label className="block text-black px-2 mt-6 text-lg">End Time<span className="text-red-500">*</span></label>
            <input
              type="time"
              name="endTime"
              placeholder="End Time (hh:mm)"
              value={formData.timings.endTime}
              onChange={handleInputChange}
              pattern="([00]?[0-9]|2[0-3]):[0-5][0-9]"
              title="Enter end time in the format hh:mm"
              required
              className="rounded-lg p-2 w-full border-2 mt-1 shadow-xl focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="m-4">
            <label className="block text-black px-2 text-lg">
              Fees Per Consultation<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="feesPerConsultation"
              placeholder="Fees per consultation"
              value={formData.feesPerConsultation}
              onChange={handleInputChange}
              required
              className="rounded-lg p-2 w-full border-2 mt-1 shadow-xl focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
        <div className="flex justify-end mx-36">
          <button
            className="p-2 w-28  bg-blue-500 rounded-md shadow-lg hover:bg-sky-600"
            type="submit"
          >
            Apply
          </button>
        </div>
      </form>
    </DocApp>
  );
}

export default ApplyDoctor;
