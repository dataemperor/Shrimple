import React, { useState } from "react";
import './components/ShrimpDemand.css'; // Fixed path

const ShrimpDemandPrediction = () => {
  const [quartileInputs, setQuartileInputs] = useState({ Q1: "", Q2: "", Q3: "" });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setQuartileInputs({ ...quartileInputs, [e.target.name]: e.target.value });
  };

  const handlePredict = () => {
    // Simplified for demo - in a real app, this would call your API
    const mockPrediction = Math.round((
      Number(quartileInputs.Q1) + 
      Number(quartileInputs.Q2) + 
      Number(quartileInputs.Q3)
    ) / 3 * 1.2);
    
    setPrediction(mockPrediction);
  };

  return (
    <div className="shrimple-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">Shrimple</div>
        <div className="nav-links">
          <a href="#" className="nav-link">
            <span className="icon">🏠</span> Home
          </a>
          <a href="#" className="nav-link active">
            <span className="icon">📊</span> Prediction
          </a>
          <a href="#" className="nav-link">
            <span className="icon">👤</span> Sign Up
          </a>
        </div>
      </nav>

      {/* Main content */}
      <div className="content-container">
        {/* Left Panel: Inputs */}
        <div className="card">
          <h2 className="card-title">Quartile Demands</h2>
          
          <div className="input-group">
            <input
              name="Q1"
              placeholder="Enter Q1 Demand"
              value={quartileInputs.Q1}
              onChange={handleChange}
              className="input-field"
            />
            
            <input
              name="Q2"
              placeholder="Enter Q2 Demand"
              value={quartileInputs.Q2}
              onChange={handleChange}
              className="input-field"
            />
            
            <input
              name="Q3"
              placeholder="Enter Q3 Demand"
              value={quartileInputs.Q3}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <button onClick={handlePredict} className="predict-button">
            Predict
          </button>
        </div>
        
        {/* Right Panel: Prediction */}
        <div className="card result-card">
          <p className="result-text">
            Fill in the quartile demands and click "Predict" to see results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShrimpDemandPrediction;
