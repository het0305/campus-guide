import React from "react";
import '../styles/departments.css';
const departments = [
  "Asha M. Tarsadia Institute of Computer Science and Technology",
  "Babu Madhav Institute of Information Technology",
  "C. G. Bhakta Institute of Biotechnology",
  "Chhotubhai Gopalbhai Patel Institute of Technology",
  "Diwaliba Polytechnic",
  "Diwaliba College of Optometry",
  "Department of Mathematics",
  "Department of Physics",
  "Tarsadia Institute of Chemical Science",
  "Department of English",
  "Bhulabhai Vanmalibhai Patel Institute of Commerce",
  "Bhulabhai Vanmalibhai Patel Institute of Computer Science",
  "Matiya Patidar Ayurvedic Hospital",
  "Maliba Pharmacy College",
  "Maniba-Bhula Nursing College",
  "Raman Bhakta School of Architecture",
  "Shrimad Rajchandra Institute of Management & Computer Application",
  "Bhulabhai Vanmalibhai Patel Institute of Management",
  "Kishorbhai Institute of Agriculture Sciences and Research Centre",
  "Shrimad Rajchandra College of Physiotherapy",
  "Jaymin School of Fashion Design & Technology",
  "Godavariba School of Interior Design",
  "SRIMCA - MBA",
  "Department of Humanities",
  "Dr. Chunibhai Vallabhbhai Patel College of Pharmacy",
  "Faculty of Physical Education, Sports and Yoga"
];

export default function Departments() {
  return (
    <div className="dept-page">
      <h1>Departments</h1>

      <div className="dept-grid">
        {departments.map((dept, index) => (
          <div className="dept-card" key={index}>
            {dept}
          </div>
        ))}
      </div>
    </div>
  );
}
