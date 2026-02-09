import React, { useEffect, useState } from "react";
import '../styles/departments.css';
import axios from 'axios';
import { getRole, getToken } from '../utils/auth';

export default function Departments(){
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  const role = getRole();
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(()=>{
    setLoading(true);
    axios.get('/api/departments')
      .then(res=> setDepartments(res.data || []))
      .catch(()=>{})
      .finally(()=> setLoading(false));
  },[]);

  const addDept = async ()=>{
    if(!newName) return alert('Enter name');
    const res = await axios.post('/api/departments', { name: newName }, { headers });
    setDepartments(s=>[...s, res.data]);
    setNewName('');
  };

  const deleteDept = async (id)=>{
    if(!confirm('Delete this department?')) return;
    await axios.delete(`/api/departments/${id}`, { headers });
    setDepartments(s=> s.filter(d=> d._id !== id));
  };

  const updateDept = async (id, name)=>{
    const res = await axios.put(`/api/departments/${id}`, { name }, { headers });
    setDepartments(s=> s.map(d=> d._id === id ? res.data : d));
  };

  return (
    <div className="dept-page">
      <h1>Departments</h1>

      {role === 'admin' && (
        <div style={{marginBottom:12}}>
          <input placeholder="New department" value={newName} onChange={e=>setNewName(e.target.value)} />
          <button onClick={addDept}>Add</button>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <div className="dept-grid">
          {departments.map((dept)=> (
            <DeptCard key={dept._id} dept={dept} isAdmin={role==='admin'} onDelete={deleteDept} onSave={updateDept} />
          ))}
        </div>
      )}
    </div>
  )
}

function DeptCard({ dept, isAdmin, onDelete, onSave }){
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(dept.name || '');
  return (
    <div className="dept-card">
      {editing ? (
        <div>
          <input value={name} onChange={e=>setName(e.target.value)} />
          <button onClick={()=>{ onSave(dept._id, name); setEditing(false); }}>Save</button>
          <button onClick={()=> setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <div>{dept.name}</div>
          {isAdmin && (
            <div style={{marginTop:8}}>
              <button onClick={()=> setEditing(true)}>Edit</button>
              <button onClick={()=> onDelete(dept._id)}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
