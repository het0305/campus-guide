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
  const [editingId, setEditingId] = useState(null);
  const [editPayload, setEditPayload] = useState({ title: "", date: "", location: "", description: "" });

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

  const startEdit = (ev) => {
    if (role !== "admin") return;
    setEditingId(ev._id || ev.id);
    const dateStr = ev.date ? new Date(ev.date).toISOString().slice(0, 10) : "";
    setEditPayload({
      title: ev.title || "",
      date: dateStr,
      location: ev.location || "",
      description: ev.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPayload({ title: "", date: "", location: "", description: "" });
  };

  const handleUpdate = async () => {
    if (role !== "admin") return;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const id = editingId;
    if (!id) return;

    const payload = {
      title: editPayload.title,
      date: editPayload.date ? new Date(editPayload.date) : undefined,
      location: editPayload.location,
      description: editPayload.description,
    };

    try {
      const res = await axios.put(`/api/events/${id}`, payload, { headers });
      setEvents((s) => s.map((e) => (e._id === id ? res.data : e)));
      cancelEdit();
    } catch (err) {
      alert("Failed to update event.");
    }
  };

  const handleDelete = async (id) => {
    if (role !== "admin") return;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    if (!confirm("Delete this event?")) return;
    try {
      await axios.delete(`/api/events/${id}`, { headers });
      setEvents((s) => s.filter((e) => (e._id || e.id) !== id));
    } catch (err) {
      alert("Failed to delete event.");
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
              {editingId === (ev._id || ev.id) ? (
                <>
                  <input
                    placeholder="Event Title"
                    value={editPayload.title}
                    onChange={(e) => setEditPayload((s) => ({ ...s, title: e.target.value }))}
                  />
                  <input
                    type="date"
                    value={editPayload.date}
                    onChange={(e) => setEditPayload((s) => ({ ...s, date: e.target.value }))}
                  />
                  <input
                    placeholder="Location"
                    value={editPayload.location}
                    onChange={(e) => setEditPayload((s) => ({ ...s, location: e.target.value }))}
                  />
                  <textarea
                    placeholder="Event Description"
                    value={editPayload.description}
                    onChange={(e) => setEditPayload((s) => ({ ...s, description: e.target.value }))}
                  />
                  <div className="event-admin-actions">
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                    <button onClick={() => handleDelete(ev._id || ev.id)}>Delete</button>
                  </div>
                </>
              ) : (
                <>
                  <h3>{ev.title}</h3>
                  <div className="meta">{ev.date} • {ev.location}</div>
                  <p>{ev.description}</p>
                  {role === "admin" && (
                    <div className="event-admin-actions">
                      <button onClick={() => startEdit(ev)}>Edit</button>
                      <button onClick={() => handleDelete(ev._id || ev.id)}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
