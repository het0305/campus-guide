import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { getRole, getName, clearAuth } from "../utils/auth";

export default function NavBar() {
  const navigate = useNavigate();
  const role = getRole();
  const name = getName();

  const isAdmin = role === "admin";

  function handleLogout() {
    clearAuth();
    navigate("/");
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        {/* Brand */}
        <div className="brand">
          <NavLink to="/">Campus Guide</NavLink>
        </div>

        {/* Links */}
        <div className="links">
          <NavLink to="/map">Map</NavLink>
          <NavLink to="/timetable">Timetable</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/departments">Departments</NavLink>
          <NavLink to="/auditoriums">Auditoriums</NavLink>

          <NavLink to="/foodcourt">Food Court</NavLink>

          <NavLink to="/contact">Contact</NavLink>

          <NavLink to="/feedback" className="btn primary">
            Visitor Feedback
          </NavLink>

          {/* Admin section: show panel / login + logout */}
          {!isAdmin && (
            <NavLink to="/admin-login" className="btn">
              Admin Login
            </NavLink>
          )}

          {isAdmin && (
            <>
              <NavLink to="/admin" className="btn">
                Admin Panel
              </NavLink>
              <button className="btn secondary" onClick={handleLogout}>
                {name ? `Logout (${name})` : "Logout"}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
