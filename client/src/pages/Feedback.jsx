import React, { useEffect, useState } from "react";
import "../styles/feedback.css";
import { getRole, getToken } from "../utils/auth";

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const role = getRole();
  const token = getToken();
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

  useEffect(() => {
    if (role === 'admin') {
      setLoading(true);
      fetch(`${API_BASE}/contact`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }).then(res => res.json())
        .then(d => setList(d || []))
        .catch(() => setList([]))
        .finally(() => setLoading(false));
    }
  }, [role, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === 'admin') return; // admins should not fill the visitor form
    try {
      await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      setSubmitted(true);
      setName(''); setEmail(''); setMessage('');
    } catch (err) {
      console.error('Failed to submit feedback', err);
      alert('Failed to submit feedback');
    }
  };

  return (
    <div className="feedback-page">
      <div className="glass-card">

        <h1>Visitor Feedback</h1>
        <p className="subtitle">
          Help us improve your campus experience.
        </p>

        {role !== 'admin' ? (!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input required value={name} onChange={e=>setName(e.target.value)} />
              <label>Name</label>
            </div>

            <div className="input-box">
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
              <label>Email</label>
            </div>

            <div className="input-box">
              <textarea rows="4" required value={message} onChange={e=>setMessage(e.target.value)}></textarea>
              <label>Your Feedback</label>
            </div>

            <button type="submit">Submit Feedback</button>
          </form>
        ) : (
          <div className="success">
            ✅ Thank you for your feedback!
          </div>
        )) : (
          <div>
            <h2 style={{ marginTop: 10 }}>All Visitor Feedback</h2>
            {loading ? <p>Loading...</p> : (
              list.length ? (
                <div style={{ display: 'grid', gap: 12 }}>
                  {list.map(c=> (
                    <div key={c._id} style={{ padding:12, borderRadius:8, background:'#f3f4f6' }}>
                      <strong>{c.name || 'Anonymous'}</strong> <span style={{ color:'#6b7280' }}>{c.email}</span>
                      <p style={{ marginTop:8 }}>{c.message}</p>
                      <small style={{ color:'#6b7280' }}>{new Date(c.createdAt).toLocaleString()}</small>
                    </div>
                  ))}
                </div>
              ) : <p>No feedback yet.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
