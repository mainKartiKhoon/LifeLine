import { useEffect, useState } from 'react'
import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminHome from './pages/AdminHome'
import PatientHome from './pages/PatientHome'
import toast from 'react-hot-toast'
import DoctorHome from './pages/DoctorHome'

function App() {

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    } else {
      navigate("/");
    }

  }, []);

  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={localStorage.getItem("role") == "admin" ? <AdminHome /> : (localStorage.getItem("role") == "patient" ? <PatientHome /> : <DoctorHome />)} />
      </Routes>
    </div>
  )
}

export default App
