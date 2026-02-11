import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { getRole, getToken } from '../utils/auth';
import '../styles/contact.css';

export default function Contact() {
  const [loading, setLoading] = useState(true);
  const [contactLocation, setContactLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const role = getRole();
  const token = getToken();

  useEffect(() => {
    setLoading(true);
    fetch('/api/settings/contact')
      .then(res => res.json())
      .then(doc => {
        setContactLocation(doc.contactLocation || '');
        setContactPhone(doc.contactPhone || '');
        setContactEmail(doc.contactEmail || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (role !== 'admin') return;
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const res = await fetch('/api/settings/contact', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ contactLocation, contactPhone, contactEmail })
    });
    if (!res.ok) alert('Failed to save');
  };

  return (
    <div className="contact-container">
      {loading ? <p>Loading...</p> : (
        <>
          <div className="contact-card">
            <MapPin size={40} className="icon" />
            <h3>OUR OFFICE LOCATION</h3>
            <hr />
            <p>{contactLocation}</p>
          </div>

          <div className="contact-card">
            <Phone size={40} className="icon" />
            <h3>OUR CONTACT NUMBER</h3>
            <hr />
            <p>{contactPhone}</p>
          </div>

          <div className="contact-card">
            <Mail size={40} className="icon" />
            <h3>OUR CONTACT E-MAIL</h3>
            <hr />
            <p>{contactEmail}</p>
          </div>
        </>
      )}

      {role === 'admin' && (
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ background: '#1f2937', color: 'white', borderRadius: 12, padding: 16 }}>
            <h3>Admin: Edit Contact Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginTop: 12 }}>
              <input
                className="contact-input"
                placeholder="Office Location"
                value={contactLocation}
                onChange={e=>setContactLocation(e.target.value)}
              />
              <input
                className="contact-input"
                placeholder="Contact Number"
                value={contactPhone}
                onChange={e=>setContactPhone(e.target.value)}
              />
              <input
                className="contact-input"
                placeholder="Contact Email"
                value={contactEmail}
                onChange={e=>setContactEmail(e.target.value)}
              />
              <button className="contact-save-btn" onClick={save}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
