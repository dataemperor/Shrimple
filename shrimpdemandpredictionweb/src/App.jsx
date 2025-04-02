import React, { useState } from "react";
import "./components/ShrimpDemand.css"; // Ensure this file exists

const ShrimpDemandPrediction = () => {
  const [quartileInputs, setQuartileInputs] = useState({ Q1: "", Q2: "", Q3: "" });
  const [prediction, setPrediction] = useState(null);
  const [explanation, setExplanation] = useState("");

  const handleChange = (e) => {
    setQuartileInputs({ ...quartileInputs, [e.target.name]: e.target.value });
  };

  const handlePredict = () => {
    const Q1 = Number(quartileInputs.Q1);
    const Q2 = Number(quartileInputs.Q2);
    const Q3 = Number(quartileInputs.Q3);

    if (isNaN(Q1) || isNaN(Q2) || isNaN(Q3)) {
      setPrediction(null);
      setExplanation("Please enter valid numbers for all quartile demands.");
      return;
    }

    const avgDemand = (Q1 + Q2 + Q3) / 3;
    const predictedDemand = Math.round(avgDemand * 1.2);

    setPrediction(predictedDemand);
    setExplanation(
      `The predicted demand is based on the average of the provided quartile values, ` +
      `adjusted with a growth factor of 1.2.`
    );
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
            <label className="input-label">Q1 Demand (Low season demand)</label>
            <input
              name="Q1"
              placeholder="Enter Q1 Demand"
              value={quartileInputs.Q1}
              onChange={handleChange}
              className="input-field"
            />

            <label className="input-label">Q2 Demand (Moderate season demand)</label>
            <input
              name="Q2"
              placeholder="Enter Q2 Demand"
              value={quartileInputs.Q2}
              onChange={handleChange}
              className="input-field"
            />

            <label className="input-label">Q3 Demand (High season demand)</label>
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
            {prediction !== null 
              ? `Predicted Demand: ${prediction}`
              : "Fill in the quartile demands and click 'Predict' to see results."}
          </p>
          <p className="explanation-text">{explanation}</p>
        </div>
      </div>
    </div>
  );
};

export default ShrimpDemandPrediction;
