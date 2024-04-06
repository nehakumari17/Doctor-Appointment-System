import React, { useEffect, useState } from 'react'
import DocApp from '../DocApp'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import moment from 'moment'

function BookingPage() {
    const { user } = useSelector((state) => state.user)
    const params = useParams()
    const [doctors, setDoctors] = useState([])
    const [date, setDate] = useState("")
    const [time, setTime] = useState()
    const [isAvailable, setIsAvailable] = useState(false)
    const navigate = useNavigate()

    const getUserData = async () => {
        try {
          const res = await axios.post(
            `${window.location.origin}/api/doctor/getDoctorById`,
            { doctorId: params.doctorId },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          if (res.data.success) {
            setDoctors(res.data.data);
          }
        } catch (error) {
          console.log(error);
        }
      };

      const handleAvailability = async () => {
        try {
          console.log("Date:", date); // Log the date value
        console.log("Time:", time);
            const res = await axios.post(
                `${window.location.origin}/api/booking-availability`,
                { doctorId: params.doctorId, date, time },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
    
            if (res.data.success) {
                setIsAvailable(true);
                toast.success(res.data.message);
            } else {
                setIsAvailable(false); 
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            setIsAvailable(false); 
        }
    };
    
      const handleBooking = async () => {
        try {
          setIsAvailable(true);
          if (!date && !time) {
            return alert("Date & Time Required");
          }
          const res = await axios.post(
            `${window.location.origin}/api/book-appointment`,
            {
              doctorId: params.doctorId,
              userId: user._id,
              doctorInfo: doctors,
              userInfo: user,
              date: date,
              time: time,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (res.data.success) {
            toast.success(res.data.message);
            navigate("/home")
          }
        } catch (error) {
          console.log(error);
        }
      }

      useEffect(() => {
        getUserData();
        
      }, []);

  return (
    <DocApp>
        <h1 className="m-3 text-3xl font-semibold">Booking page</h1>
        {doctors && (
            <div className="max-w-sm mx-20 mt-5 shadow-md rounded-md overflow-hidden cursor-pointer" style={{ border: "1px solid black" }}>
            <div className="bg-gray-200 text-gray-700 px-4 py-2 text-lg font-semibold" style={{ "border-bottom": "1px solid black" }} >
              Dr. {doctors.firstName} {doctors.lastName}
            </div>
            <div className="p-4">
              <p className="mb-2">
                <span className="font-semibold">Specialization:</span> {doctors.specialization}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Experience:</span> {doctors.experience}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Fees Per Consultation:</span> {doctors.feesPerConsultation}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Timing:</span>{" "} {doctors.timings && `${doctors.timings.startTime} - ${doctors.timings.endTime}`}
              </p>
            </div>
            <div className="flex justify-evenly mt-1">
            <input
    className="rounded-lg p-2 border-2 focus:outline-none focus:border-blue-400"
    type="date"
    id="appointmentDate"
    onChange={(event) => {
        setDate(moment(event.target.value, "YYYY-MM-DD").format("DD-MM-YYYY"));
    }}
/>

<input
    className="rounded-lg p-2 border-2 focus:outline-none focus:border-blue-400"
    type="time"
    id="appointmentTime"
    onChange={(event) => {
        setTime(moment(event.target.value, "HH:mm").format("HH:mm"));
    }}
/>

            </div>
                <button
                    className="my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-7 rounded shadow"
                    onClick={handleAvailability}
                >
                Check Availability
                </button>
                  <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-7 rounded shadow"
                  onClick={handleBooking}
              >
                Book Now
              </button>
          </div>
        )}
    </DocApp>
  )
}

export default BookingPage