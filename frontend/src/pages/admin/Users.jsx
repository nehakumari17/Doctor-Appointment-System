import React, { useEffect, useState } from 'react'
import DocApp from '../DocApp'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

function Users() {
  const [users, setUsers] = useState([])

  const getUsers = async () => {
    try {
      const res = await axios.get(`${window.location.origin}/api/admin/getAllUsers`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      if(res.data.success){
        setUsers(res.data.data)
      }
    } catch (error) {
      toast.error("Something went wrong!!")
    }
  }

  const handleDelete = async (userId) => {
    try {
      const res = await axios.delete(
        `${window.location.origin}/api/admin/removeUser/${userId}`, // Corrected the URL to include the doctorId
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
        toast.success("User removed successfully!");
      } else {
        toast.error("Failed to remove User");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <DocApp>
        <Toaster />
        <h1 className="text-center text-2xl font-semibold">Users List</h1>
        <table className="w-[96.5%] m-5 divide-y divide-gray-600 rounded-md">
      <thead className="bg-gray-200">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
          >
            Name
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
          >
            Email
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
          >
            Doctor
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-600">
          {users.map(user => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.isDoctor ? 'Yes' : 'No'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 uppercase rounded-md" onClick={() => handleDelete(user._id)}>
                    DELETE
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
    </table>
    </DocApp>
  )
}

export default Users