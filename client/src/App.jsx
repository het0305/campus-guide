import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Departments from './pages/Departments'
import Events from './pages/Events'
import MapPage from './pages/Map'

import Login from './pages/Login'
import StudentDashboard from './pages/student/Dashboard'
import StaffDashboard from './pages/staff/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Timetable from './pages/student/Timetable';
import "leaflet/dist/leaflet.css";
import Attendance from "./pages/staff/Attendance";
import Contact from './pages/Contact'

export default function App(){
  return (
    <div>
      <NavBar />
      <main style={{padding:'1rem'}}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/departments" element={<Departments/>} />
          <Route path="/events" element={<Events/>} />
          <Route path="/map" element={<MapPage/>} />
         
          <Route path="/login" element={<Login/>} />
          <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentDashboard/></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute requiredRole="staff"><StaffDashboard/></ProtectedRoute>} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/staff/attendance" element={<Attendance />} />
        </Routes>
      </main>
    </div>
  )
}
