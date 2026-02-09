import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import { Link } from "react-router-dom";

export default function StaffDashboard() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get("/api/staff/dashboard", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((r) => setMsg(r.data.msg))
      .catch(() => setMsg("Unable to load dashboard data"));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>👩‍🏫 Staff Dashboard</h2>
      <p>{msg}</p>

      <hr style={{ margin: "20px 0" }} />

      <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
        {/* Attendance (removed) */}

        {/* Create Event */}
        <Link to="/staff/create-event" style={cardStyle}>
          📢 Create Event
        </Link>

        {/* View Timetable */}
        <Link to="/timetable" style={cardStyle}>
          🗓 Timetable
        </Link>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "14px 20px",
  background: "#2563eb",
  color: "white",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "600",
};
