import React, { useState } from 'react'
import { Link,  useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../authentication/authSlice';
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios';
const baseURL = `${window.location.origin}/api/login`

function Login() {

    const [users, setUsers] = useState({
        email:"",
        password:""
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleInput = (e) => {
        let name = e.target.name
        let value = e.target.value

        setUsers({
            ...users,
            [name]: value
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(baseURL, users)
            if (response.status === 200) {
                const userData = response.data.user;
                localStorage.setItem("token", response.data.token)
                toast.success("Login successful");
                dispatch(login({user: userData}))
                navigate("/home");
            } else {
                toast.error("Unexpected response data");
            }
        } catch (error) {
            toast.error("Invalid Login!!")
            
        }
        
    }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-blue-100'>
        <Toaster />
        <div className='p-8 rounded-lg max-w-md w-full shadow-2xl'  style={{ background: "#9eb4db" }}>
            <span className='font-bold text-2xl mx-24 '>Welcome Back</span>
            <form className='mt-4' onSubmit={handleLogin}>
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder='Email address'
                        value={users.email}
                        onChange={handleInput}
                        className='rounded-lg p-4 w-full border-2 mx-auto block m-4 shadow-xl focus:outline-none focus:border-blue-400'
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder='Password'
                        value={users.password}
                        onChange={handleInput}
                        className='rounded-lg p-4 w-full border-2 mx-auto block m-4 shadow-xl focus:outline-none focus:border-blue-400'
                    />
                </div>
                <button
                 type='submit'
                 className='w-28 p-4 mt-4 mx-auto block bg-blue-400 rounded-full shadow-xl text-black font-bold hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 transition-all duration-200 ease-in-out' >
                    Login
                </button>
            </form>
            
            <div className='mt-5 mx-16 font-bold text-black'>
                <span>Don't have an account?</span>
                <Link to="/register" className='mx-2  hover:text-purple-700'>Register</Link>
            </div>
        </div>
    </div>
  )
}

export default Login