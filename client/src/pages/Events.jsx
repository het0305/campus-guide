import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/events.css";
import { getRole, getToken } from "../utils/auth";

function AdminCreate({ onCreate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");

  const submit = () => {
    if (!title || !date) return alert("Enter title and date");

    onCreate({
      title,
      date,
      location,
      description: desc,
    });

    setTitle("");
    setDate("");
    setLocation("");
    setDesc("");
  };

  return (
    <div className="event-admin-box">

      <h2>Create Event</h2>

      <div className="event-row">
        <input
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <textarea
        placeholder="Event Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <div className="event-submit">
        <button onClick={submit}>Publish Event</button>
      </div>

    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = getRole();
  const token = getToken();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/events")
      .then((res) => setEvents(res.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (payload) => {
    if (role !== "admin") return alert("Only admins can create events");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const res = await axios.post("/api/events", payload, { headers });
      setEvents((s) => [res.data, ...s]);
    } catch (err) {
      alert("Failed to create event");
    }
  };

  return (
    <div className="events-page">
      <h1>Events</h1>

      {role === "admin" && <AdminCreate onCreate={handleCreate} />}

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="events-list">
          {events.map((ev) => (
            <div key={ev._id || ev.id || ev.title + ev.date} className="event-card">
              <h3>{ev.title}</h3>
              <div className="meta">{ev.date} • {ev.location}</div>
              <p>{ev.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
