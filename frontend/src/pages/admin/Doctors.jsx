import React, { useEffect, useState } from 'react'
import DocApp from '../DocApp'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

function Doctors() {

  const [doctors, setDoctors] = useState([])

  const getDoctors = async () => {
    try{
      const res = await axios.get(`${window.location.origin}/api/admin/getAllDoctors`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if(res.data.success){
        setDoctors(res.data.data)
      }
    } catch(error){
      console.log(error)
      toast.error("Something went wrong!!")
    }
  }

  const handleAccept = async (doctorId, userId, status) => {
    try{
      const res = await axios.post(`${window.location.origin}/api/admin/acceptApplication`,
      {
        doctorId, 
        userId,
        status},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
      })
      if(res.data.success){
        toast.success(res.data.message)
      }
    } catch(error){
      console.log(error)
      toast.error("Something went wrong!!")
    }
  }

  const handleReject = async (doctorId) => {
    try {
        const res = await axios.delete(`${window.location.origin}/api/admin/rejectApplication/${doctorId}/rejected`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (res.data.success) {
            console.log("Doctors before rejection:", doctors);
            if (res.data.data && res.data.data.status) {
                setDoctors(prevDoctors => prevDoctors.filter(doctor => doctor._id !== doctorId));
            }
            console.log("Doctors after rejection:", doctors);
            toast.success("Doctor application is rejected successfully!!");
        }
    } catch (error) {
        console.log(error);
        toast.error("Something went wrong!!");
    }
};

  const handleRemove = async (doctorId) => {
    try{
      const res = await axios.delete(`${window.location.origin}/api/admin/removeDoctor/${doctorId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if(res.data.success){
        setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor._id !== doctorId))
        toast.success("Doctor removed successfully")
      } else {
        toast.error("Failed to remove doctor")
      }
      window.location.reload()
    } catch(error){
      console.log(error)
      toast.error("Something went wrong!!")
    }
  }

  useEffect(() => {
    getDoctors()
  }, [])

  return (
    <DocApp>
        <Toaster />
        <h1 className='text-center text-2xl font-semibold'>Doctors List</h1>
        <table className="w-[96.5%] m-5 divide-y divide-gray-600 rounded-md">
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
                Phone
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"> 
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
  {doctors.map(doctor => (
    <tr key={doctor._id}>
      <td className="px-6 py-4 whitespace-nowrap">{doctor.firstName} {doctor.lastName}</td>
      <td className="px-6 py-4 whitespace-nowrap">{doctor.status}</td>
      <td className="px-6 py-4 whitespace-nowrap">{doctor.phone}</td>
      <td className="px-6 py-4 whitespace-nowrap">
      {doctor.status === "pending" && (<div className="d-flex">
          
          <button className="bg-green-500 mx-2 hover:bg-green-600 text-white px-4 py-2 rounded-md" onClick={() => handleAccept(doctor._id, doctor.userId, "approved")} >
            Accept
          </button>
          <button className="bg-red-500 mx-2 hover:bg-red-600 text-white px-4 py-2 rounded-md" onClick={() => handleReject(doctor._id, doctor.userId, "rejected")}>
            Reject
          </button>
        
      </div>) }
      {doctor.status === "approved" && (
  <div className="d-flex">
    <button className="bg-blue-500 mx-2 hover:bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => handleRemove(doctor._id)}>
      Remove
    </button>
  </div>
)}
        
      </td>
    </tr>
  ))}
</tbody>
        </table>
    </DocApp>
  )
}

export default Doctors