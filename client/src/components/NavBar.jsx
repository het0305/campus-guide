import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/navbar.css'


export default function NavBar(){
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="brand"><Link to="/">Campus Guide</Link></div>
        <div className="links">
          <Link to="/departments">Departments</Link>
          <Link to="/events">Events</Link>
          <Link to="/timetable">Timetable</Link>
          <Link to="/map">Map</Link>
          <Link to="/staff/attendance">Attendance</Link>
          <Link to="/login">Login</Link>
          
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </nav>
  )
}
