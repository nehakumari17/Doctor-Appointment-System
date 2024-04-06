import React, { useEffect, useState } from 'react'
import DocApp from '../DocApp'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function DoctorAppointment() {
    const [appointments, setAppointments] = useState([])

    const getAppointments = async () => {
        try {
          const res = await axios.get(`${window.location.origin}/api/doctor/doctor-appointments`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (res.data.success) {
            setAppointments(res.data.data);
          }
        } catch (error) {
          toast.error("Something went wrong");
        }
      }

      const acceptAppointment = async (appointmentId, status) => {
        try {
          const res = await axios.post(
            `${window.location.origin}/api/doctor/acceptAppointment`,
            { appointmentId, status },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (res.data.success) {
            toast.success(res.data.message);
            getAppointments();
          }
        } catch (error) {
          toast.error("Something Went Wrong");
        }
      }

      const handleReject = async (appointmentId) => {
        try{
          const res = await axios.delete(`${window.location.origin}/api/doctor/rejectAppointment/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          })
          if(res.data.success){
            setAppointments((prevAppointment) => prevAppointment.filter((appointment) => appointment._id !== appointmentId))
            toast.success("Appointment rejected successfully")
          } else {
            toast.error("Failed to reject appointment")
          }
          window.location.reload()
        } catch(error){
          toast.error("Something went wrong!!")
        }
      }

      const handleCompleted = async (appointmentId) => {
        try{
          const res = await axios.delete(`${window.location.origin}/api/doctor/completedAppointment/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          })
          
          if(res.data.success){
            setAppointments((prevAppointment) => prevAppointment.filter((appointment) => appointment._id !== appointmentId))
            toast.success("Appointment completed")
          }
          else {
            toast.error("Failed to complete appointment")
          }

        } catch(error) {
          toast.error("Something went wrong!!")
        }
      }

      useEffect(() => {
        getAppointments();
      }, [])

      console.log(appointments)
  return (
    <DocApp>
        <Toaster />
        <h1 className="text-2xl fone-medium m-4">Doctor Appointments</h1>
        <table className="w-[96.5%] m-5 divide-y divide-gray-800 rounded-md" style={{border: "1px solid black"}}>
          <thead className="bg-gray-200">
            <tr>
              <th
                scope='col'
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"> 
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"> 
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"> 
                Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"> 
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
  {appointments.map(appointment => (
    <tr key={appointment._id}>
      <td className="px-6 py-4 whitespace-nowrap">{appointment.userInfo.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">{appointment.status}</td>
      <td className="px-6 py-4 whitespace-nowrap">{appointment.date}</td>
      <td className="px-6 py-4 whitespace-nowrap">{appointment.time}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {appointment.status === "pending" && (<div className="d-flex">
          
          <button className="bg-green-500 mx-2 hover:bg-green-600 text-white px-4 py-2 rounded-md" onClick={() => acceptAppointment(appointment._id , "approved")} >
            Accept
          </button>
          <button className="bg-red-500 mx-2 hover:bg-red-600 text-white px-4 py-2 rounded-md" onClick={() => handleReject(appointment._id)}>
            Reject
          </button>
      </div>)}
      {appointment.status === "approved" && (<div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md" onClick={() => handleCompleted(appointment._id)}>Completed</button>
      </div>)}
      </td>
    </tr>
  ))}
</tbody>
        </table>

    </DocApp>
  )
}

export default DoctorAppointment