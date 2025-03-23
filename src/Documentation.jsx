import React from 'react'
import './Documentation.css'
import { Link } from 'react-router-dom'

const Documentation = () => {
  return (
    <div className="documentation-container">
      <nav className="navbar">
        <div className="logo">
          Poker Sprint Planner
        </div>
        <div className="nav-links">
          <span><Link to="/" className="nav-link">Home</Link></span>
          <span>Documentation</span>
        </div>
      </nav>

      <div className="content-wrapper">
        <section className="doc-section">
          <h1>Documentation</h1>
          <p className="intro">
            Poker Sprint Planner is a real-time collaborative planning tool for agile teams.
            It enables teams to efficiently estimate story points and gather team happiness feedback.
          </p>
        </section>
        <section className="doc-section">
          <h2>Getting Started</h2>
          <div className="getting-started-content">
            <h3>For Masters (Scrum Masters)</h3>
            <ol>
              <li>Enter PI Name and Sprint Name</li>
              <li>Add stories for estimation</li>
              <li>Click "Start Poker" to begin session</li>
              <li>Share the generated URL with team</li>
              <li>Control story selection and voting reveals</li>
            </ol>

            <h3>For Team Members</h3>
            <ol>
              <li>Join using the shared URL</li>
              <li>Enter your name</li>
              <li>Vote on stories when active</li>
              <li>Provide happiness feedback when requested</li>
            </ol>
          </div>
        </section>

        <section className="doc-section">
          <h2>Core Technologies</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <h3>React</h3>
              <p>Frontend library for building user interfaces</p>
              <ul>
                <li>Version: 18.x</li>
                <li>Hooks for state management</li>
                <li>Component-based architecture</li>
              </ul>
            </div>
            <div className="tech-card">
              <h3>Firebase</h3>
              <p>Backend and real-time database</p>
              <ul>
                <li>Realtime Database</li>
                <li>Real-time data synchronization</li>
                <li>WebSocket connections</li>
              </ul>
            </div>
            <div className="tech-card">
              <h3>React Icons</h3>
              <p>Icon library for React applications</p>
              <ul>
                <li>Comprehensive icon set</li>
                <li>Easy integration</li>
                <li>Customizable styling</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="doc-section">
          <h2>Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Planning Poker</h3>
              <ul>
                <li>Real-time voting system</li>
                <li>Story point estimation</li>
                <li>Synchronized card reveals</li>
                <li>Average point calculation</li>
              </ul>
            </div>
            <div className="feature-card">
              <h3>Team Happiness</h3>
              <ul>
                <li>Happiness survey</li>
                <li>Anonymous feedback</li>
                <li>Real-time updates</li>
                <li>Team satisfaction tracking</li>
              </ul>
            </div>
            <div className="feature-card">
              <h3>Session Management</h3>
              <ul>
                <li>Unique room creation</li>
                <li>Participant management</li>
                <li>Status tracking</li>
                <li>Data persistence</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="doc-section">
          <h2>Architecture</h2>
          <div className="architecture-content">
            <h3>Frontend Architecture</h3>
            <ul>
              <li>Component-based structure for modularity</li>
              <li>React hooks for state management</li>
              <li>Real-time data synchronization with Firebase</li>
              <li>Responsive design with CSS Grid and Flexbox</li>
              <li>Neumorphic design system</li>
            </ul>

            <h3>Backend Architecture</h3>
            <ul>
              <li>Firebase Realtime Database for data storage</li>
              <li>WebSocket connections for real-time updates</li>
              <li>JSON data structure for efficient updates</li>
              <li>Client-side state management</li>
            </ul>
          </div>
        </section>


      </div>
    </div>
  )
}

export default Documentation 