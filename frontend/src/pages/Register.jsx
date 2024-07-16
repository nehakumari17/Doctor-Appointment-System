import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
const baseURL = `${window.location.origin}/api/register`

function Register() {
    const [user, setUser] = useState({
        name:"",
        email:"",
        password:""
    })
    const navigate = useNavigate()

    const handleInput = (e) => {
        let name = e.target.name
        let value = e.target.value

        setUser({
            ...user,
            [name]: value
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(baseURL, user)
            if (response.status === 200) {
                setUser({
                    name: "",
                    email: "",
                    password: ""
                });
                toast.success('Registration Successful!', {
                    icon: '👏',
                });
                navigate("/login");
            } else {
                toast.error("Unexpected error occurred. Please try again later.");
            }
            
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400 && error.response.data.message === "User already exists with this email") {
                    toast.error("User already exists with this email.");
                } else {
                    toast.error("Unexpected error occurred. Please try again later.");
                }
            } else if (error.request) {
                toast.error("No response received from server. Please check your internet connection.");
            } else {
                toast.error("An unexpected error occurred. Please try again later.");
            }
        }
    }
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-blue-100'>
        <Toaster />
        <div className='p-8 rounded-lg max-w-md w-full shadow-2xl'  style={{ background: "#9eb4db" }}>
            <span className='font-bold text-2xl mx-24'>Hello New User</span>
            <form onSubmit={handleRegister}>
                <div>
                    <input
                     type="text"
                     name='name'
                     placeholder='Name' 
                     value={user.name}
                     onChange={handleInput}
                     className='rounded-lg p-4 w-full border-2 mx-auto block m-4 shadow-xl focus:outline-none focus:border-blue-400'
                    />
                </div>
                <div>
                    <input
                     type="email"
                     placeholder='Email address'
                     name='email'
                     value={user.email}
                     onChange={handleInput}
                     className='rounded-lg p-4 w-full border-2 mx-auto block m-4 shadow-xl focus:outline-none focus:border-blue-400' 
                    />
                </div>
                <div>
                    <input
                     type="password"
                     placeholder='Password' 
                     name='password'
                     value={user.password}
                     onChange={handleInput}
                     className='rounded-lg p-4 w-full border-2 mx-auto block m-4 shadow-xl focus:outline-none focus:border-blue-400'
                    />
                </div>
                <button
                 type='submit'
                 className='w-28 p-4 mt-5 mx-auto block bg-blue-400 rounded-full shadow-xl text-black font-bold hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 transition-all duration-200 ease-in-out' >
                    Signup
                </button>
            </form>
            <div className='mt-5 font-bold mx-10'>
                <span>Already have an account?</span>
                <Link to="/login" className='mx-3 hover:text-purple-700'>Login</Link>
            </div>
        </div>
    </div>
  )
}

export default Register