import React, { useEffect, useState } from "react";
import DocApp from "../DocApp";
import axios from "axios";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        `${window.location.origin}/api/user-appointments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        const allAppointments = res.data.data;
        const approved = allAppointments.filter(
          (appointment) => appointment.status === "approved"
        );
        setAppointments(approved);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <DocApp>

      <h1 className="text-2xl fone-medium m-4">User Appointments</h1>
      <table
        className="w-[96.5%] m-5 divide-y divide-gray-600 rounded-md"
        style={{ border: "1px solid black" }}
      >
        <thead className="bg-gray-200">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Appointment ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Doctor Name
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Time
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Phone
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(
            (appointment) => (
              console.log(appointment.doctorId.firstName),
              (
                <tr key={appointment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.doctorInfo?.firstName} {appointment.doctorInfo.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.doctorInfo.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.status === "approved" && (
                      <div>{appointment.status}</div>
                    )}
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </DocApp>
  );
}

export default Appointments;
