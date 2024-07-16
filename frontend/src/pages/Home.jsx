import React from 'react'
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to Doctor Appointment System</h1>
      <p className="text-lg mb-8">Manage your appointments with ease.</p>
      <div className="flex space-x-4">
        <Link to="/login" className="bg-blue-400 hover:bg-blue-500 px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 ease-in-out">Login</Link>
        <Link to="/register" className="bg-green-400 hover:bg-green-500 px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 ease-in-out">Register</Link>
      </div>
    </div>
  )
}

export default Home