import React from 'react'
import '../styles/AdvancedUI.css'

export default function AdvancedUI(){
  return (
    <div className="adv-page">
      <div className="adv-container">
        <div className="adv-card">
          <div className="adv-header">
            <h2>Advanced UI Card</h2>
            <p className="sub">Interactive, modern, glassmorphic card</p>
          </div>

          <div className="adv-body">
            <p>This is an example of an advanced-looking UI box with layered gradients, subtle shadows, frosted glass effect, and micro-interactions on hover.</p>
            <div className="adv-stats">
              <div className="stat">
                <div className="value">1.2K</div>
                <div className="label">Users</div>
              </div>
              <div className="stat">
                <div className="value">86%</div>
                <div className="label">Satisfaction</div>
              </div>
              <div className="stat">
                <div className="value">24</div>
                <div className="label">New</div>
              </div>
            </div>

            <div className="adv-actions">
              <button className="btn primary">Primary Action</button>
              <button className="btn ghost">Secondary</button>
            </div>
          </div>

          <div className="adv-accent" />
        </div>
      </div>
    </div>
  )
}
