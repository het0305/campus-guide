import React from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Departments from "./pages/Departments";
import Events from "./pages/Events";
import MapPage from "./pages/Map";
import StudentDashboard from "./pages/student/Dashboard";
import StaffDashboard from "./pages/staff/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Timetable from "./pages/Timetable";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import FoodCourt from "./pages/FoodCourt";
import Auditoriums from "./pages/Auditoriums";

import RoleSelect from "./pages/RoleSelect";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Visitor from "./pages/Visitor";

import "leaflet/dist/leaflet.css";

export default function App() {
  return (
    <div style={{ width: "100vw", overflowX: "hidden" }}>
      <Routes>
        {/* First Screen */}
        <Route path="/" element={<RoleSelect />} />

        {/* Visitor */}
        <Route
          path="/visitor"
          element={
            <>
              <NavBar />
              <main style={{ padding: "1rem" }}>
                <Visitor />
                <Home />
              </main>
            </>
          }
        />

        {/* Admin */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Main App Routes */}
        <Route
          path="/departments"
          element={
            <>
              <NavBar />
              <Departments />
            </>
          }
        />
        <Route
          path="/events"
          element={
            <>
              <NavBar />
              <Events />
            </>
          }
        />
        <Route
          path="/map"
          element={
            <>
              <NavBar />
              <MapPage />
            </>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute requiredRole="student">
              <NavBar />
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute requiredRole="staff">
              <NavBar />
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/timetable"
          element={
            <>
              <NavBar />
              <Timetable />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <NavBar />
              <Contact />
            </>
          }
        />
        <Route
          path="/auditoriums"
          element={
            <>
              <NavBar />
              <Auditoriums />
            </>
          }
        />
        <Route
          path="/feedback"
          element={
            <>
              <NavBar />
              <Feedback />
            </>
          }
        />
        <Route
          path="/foodcourt"
          element={
            <>
              <NavBar />
              <FoodCourt />
            </>
          }
        />
      </Routes>
    </div>
  );
}
