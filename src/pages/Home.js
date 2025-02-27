// src/pages/HomePage.js
import React from 'react';

function Home() {
  return (
    <div className="home-page">
      <header className="hero">
        <h1>Predict the Best Shrimp Farming Grounds in Sri Lanka</h1>
        <button>Get Started</button>
      </header>
      <section className="features">
        <div className="feature">
          <h3>Live Map</h3>
          <p>Interactive tools for selecting lagoon areas.</p>
        </div>
        <div className="feature">
          <h3>Environmental Data</h3>
          <p>Analyze key parameters for shrimp farming.</p>
        </div>
        <div className="feature">
          <h3>Predictive Analysis</h3>
          <p>AI-powered insights for suitability scoring.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
