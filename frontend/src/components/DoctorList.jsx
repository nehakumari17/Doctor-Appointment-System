import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function DoctorList({ doctor }) {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)

    const shouldNavigate = user && !user.user?.isDoctor && !user.user?.isAdmin

    const handleClick = () => {
      if (shouldNavigate) {
        navigate(`${window.location.origin}/api/doctor/book-appointment/${doctor._id}`);
      }
    }
  return (
    <div className="max-w-xs mx-2 mt-2 mb-8 shadow-md rounded-md overflow-hidden cursor-pointer"  style={{ border: '1px solid black' }} onClick={handleClick}>
      <div className="bg-gray-200 text-gray-700 px-4 py-2 text-lg font-semibold">
        Dr. {doctor.firstName} {doctor.lastName}
      </div>
      <hr className='border-t-2 border-gray-600' />
      <div className="p-4">
        <p className="mb-2">
          <span className="font-semibold">Specialization:</span> {doctor.specialization}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Experience:</span> {doctor.experience}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Fees Per Consultation:</span> {doctor.feesPerConsultation}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Timing:</span> {doctor.timings.startTime} - {doctor.timings.endTime}
        </p>
      </div>
    </div>
  );
}

export default DoctorList;
