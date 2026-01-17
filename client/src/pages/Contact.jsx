import React from 'react';

import { MapPin, Phone, Mail } from 'lucide-react';
import '../styles/contact.css'
export default function Contact() {
  return (
    <div className="contact-container">

      {/* Office Location */}
      <div className="contact-card">
        <MapPin size={40} className="icon" />
        <h3>OUR OFFICE LOCATION</h3>
        <hr />
        <p>
          Uka Tarsadia University Maliba Campus,  
          Gopal Vidyanagar, Bardoli-Mahuva Road,  
          Tarsadi – 394350,  
          Tal: Mahuva Dist: Surat, Gujarat, INDIA.
        </p>
      </div>

      {/* Contact Number */}
      <div className="contact-card">
        <Phone size={40} className="icon" />
        <h3>OUR CONTACT NUMBER</h3>
        <hr />
        <p>
          6353030096, 6353033853 <br />
          Working Day: 08:30 AM – 04:30 PM
        </p>
      </div>

      {/* Email */}
      <div className="contact-card">
        <Mail size={40} className="icon" />
        <h3>OUR CONTACT E-MAIL</h3>
        <hr />
        <p>registrar[at]utu[dot]ac[dot]in</p>
      </div>

    </div>
  );
}
