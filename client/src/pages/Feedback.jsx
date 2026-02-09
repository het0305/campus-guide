import React, { useState } from "react";
import "../styles/feedback.css";

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="feedback-page">
      <div className="glass-card">

        <h1>Visitor Feedback</h1>
        <p className="subtitle">
          Help us improve your campus experience.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input required />
              <label>Name</label>
            </div>

            <div className="input-box">
              <input type="email" required />
              <label>Email</label>
            </div>

            <div className="input-box">
              <textarea rows="4" required></textarea>
              <label>Your Feedback</label>
            </div>

            <button type="submit">Submit Feedback</button>
          </form>
        ) : (
          <div className="success">
            ✅ Thank you for your feedback!
          </div>
        )}

      </div>
    </div>
  );
}
