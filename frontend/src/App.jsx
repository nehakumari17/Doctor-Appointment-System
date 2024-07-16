import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './authentication/authSlice';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DocApp from './pages/DocApp';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import ApplyDoctor from './pages/user/ApplyDoctor';
import HomePage from './pages/HomePage';
import NotificationPage from './pages/NotificationPage';
import Users from './pages/admin/Users';
import Doctors from './pages/admin/Doctors';
import Profile from './pages/doctor/Profile';
import BookingPage from './pages/user/BookingPage';
import DoctorAppointment from './pages/doctor/DoctorAppointment';
import UserAppointments from './pages/user/UserAppointments';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if ( token) {
      dispatch(login({token}));
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
            <Home />
        } />

        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
          
        }/>

        <Route path="/doctor-app" element={
          <DocApp />
        } />

        <Route path="/user-appointments" element={
          <ProtectedRoute>
            <UserAppointments />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path='/apply-doctor' element={
          <ProtectedRoute>
            <ApplyDoctor />
          </ProtectedRoute>
          
        } />

        <Route path="/notification-page" element={
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        } />

        <Route path="/admin/user" element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        } />

        <Route path="/admin/doctor" element={
          <ProtectedRoute>
            <Doctors />
          </ProtectedRoute>
        } />

        <Route path="/doctor/profile/:id" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/doctor/book-appointment/:doctorId" element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        } />

        <Route path="/doctor-appointments" element={
          <ProtectedRoute>
            <DoctorAppointment />
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;