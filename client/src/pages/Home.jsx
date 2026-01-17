import React from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">

      {/* Floating background shapes */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      {/* HERO */}
<section className="hero">
  <h1>
    Welcome to <span>Uka Tarsadia University</span>
  </h1>

  <h2 className="tagline">
    Empowering Knowledge • Inspiring Innovation • Building Futures
  </h2>

  <p>
    Discover a smarter way to explore campus life — navigate buildings,
    access departments, track events, and manage your academic journey
    with ease.
  </p>

  <div className="hero-buttons">
    <Link to="/departments" className="btn primary">
      Explore Departments
    </Link>
    <Link to="/map" className="btn secondary">
      Open Campus Map
    </Link>
  </div>
</section>


      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          🏫
          <h3>Smart Navigation</h3>
          <p>Find buildings, labs, offices and classrooms instantly.</p>
        </div>

        <div className="feature-card">
          📅
          <h3>Events & Activities</h3>
          <p>Stay updated with university programs and workshops.</p>
        </div>

        <div className="feature-card">
          🎓
          <h3>Student Dashboard</h3>
          <p>View attendance, timetable and announcements.</p>
        </div>
      </section>

    </div>
  );
}
