import React, { useEffect, useState } from "react";
import "../styles/auditoriums.css";
import axios from 'axios';
import { getRole, getToken } from '../utils/auth';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function Auditoriums(){
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHall, setNewHall] = useState({ name: '', capacity: '', location: '' });

  const role = getRole();
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(()=>{
    setLoading(true);
    axios.get(`${API_BASE}/auditoriums`)
      .then(res=> setHalls(res.data || []))
      .catch(()=>{})
      .finally(()=> setLoading(false));
  },[]);

  const addHall = async ()=>{
    if(!newHall.name) return alert('Enter hall name');
    const res = await axios.post(`${API_BASE}/auditoriums`, { name: newHall.name, capacity: newHall.capacity || undefined, location: newHall.location }, { headers });
    setHalls(s=> [...s, res.data]);
    setNewHall({ name:'', capacity:'', location:'' });
  };

  const deleteHall = async (id)=>{
    if(!confirm('Delete this hall?')) return;
    await axios.delete(`${API_BASE}/auditoriums/${id}`, { headers });
    setHalls(s=> s.filter(h=> h._id !== id));
  };

  const updateHall = async (id, payload)=>{
    const res = await axios.put(`${API_BASE}/auditoriums/${id}`, payload, { headers });
    setHalls(s=> s.map(h=> h._id === id ? res.data : h));
  };

  return (
    <div className="auditoriums">
      <h2>Auditoriums / Halls</h2>

      {role === 'admin' && (
        <div className="hall-admin-box">
          <div className="hall-grid">
            <input className="hall-input" placeholder="Hall name" value={newHall.name} onChange={e=>setNewHall({...newHall, name: e.target.value})} />
            <input className="hall-input" placeholder="Capacity" value={newHall.capacity} onChange={e=>setNewHall({...newHall, capacity: e.target.value})} />
            <input className="hall-input" placeholder="Location" value={newHall.location} onChange={e=>setNewHall({...newHall, location: e.target.value})} />
          </div>
          <div className="hall-actions">
            <button className="hall-add-btn" onClick={addHall}>Add Auditorium</button>
          </div>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <table>
          <thead>
            <tr>
              <th>Hall / Auditorium Name</th>
              <th>Capacity</th>
              <th>Location</th>
              {role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {halls.map(hall => (
              <HallRow key={hall._id} hall={hall} isAdmin={role==='admin'} onDelete={deleteHall} onSave={updateHall} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function HallRow({ hall, isAdmin, onDelete, onSave }){
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(hall.name || '');
  const [capacity, setCapacity] = useState(hall.capacity || '');
  const [location, setLocation] = useState(hall.location || '');

  return (
    <tr>
      <td>
        {editing ? <input value={name} onChange={e=>setName(e.target.value)} /> : name}
      </td>
      <td>{editing ? <input value={capacity} onChange={e=>setCapacity(e.target.value)} /> : capacity}</td>
      <td>{editing ? <input value={location} onChange={e=>setLocation(e.target.value)} /> : location}</td>
      {isAdmin && (
        <td>
          {editing ? (
            <>
              <button onClick={()=>{ onSave(hall._id, { name, capacity, location }); setEditing(false); }}>Save</button>
              <button onClick={()=> setEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={()=> setEditing(true)}>Edit</button>
              <button onClick={()=> onDelete(hall._id)}>Delete</button>
            </>
          )}
        </td>
      )}
    </tr>
  )
}
