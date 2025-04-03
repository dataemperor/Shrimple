import React, { useState } from "react";
import "./ShrimpDemand.css"; // Import the CSS file

const ShrimpDemandPrediction = () => {
  const [quartileInputs, setQuartileInputs] = useState({
    Q1: "",
    Q2: "",
    Q3: ""
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setQuartileInputs({ ...quartileInputs, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    if (!quartileInputs.Q1 || !quartileInputs.Q2 || !quartileInputs.Q3) {
      alert("Please fill in all three quartile values");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quartileInputs),
      });
  
      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch prediction.");
    }
  
    setLoading(false);
  };

    setLoading(true);
    
    setTimeout(() => {
      const lag1 = Number(quartileInputs.Q3);
      const lag2 = Number(quartileInputs.Q2);
      const rollingMean = (Number(quartileInputs.Q1) + Number(quartileInputs.Q2) + Number(quartileInputs.Q3)) / 3;
      
      const mockPrediction = Math.round((lag1 * 0.5) + (lag2 * 0.2) + (rollingMean * 0.3) * 1.05);
      
      setPrediction(mockPrediction);
      setLoading(false);
    }, 1000);

  return (
    <div className="shrimple-container">
      <nav className="navbar">
        <div className="brand">Shrimple</div>
        <div className="nav-links">
          <a href="#" className="nav-link">🏠 Home</a>
          <a href="#" className="nav-link active">📊 Prediction</a>
          <a href="#" className="nav-link">👤 Sign Up</a>
        </div>
      </nav>

      <div className="content-container">
        <div className="card input-card">
          <h2 className="card-title">Quartile Demands</h2>
          
          <div className="instructions">
            <h3>How to Use This Tool</h3>
            <p>This tool predicts shrimp demand for the next quartile based on historical data.</p>
            <ul>
              <li>Enter the shrimp demand values for the last three quartiles</li>
              <li>Values should be positive numbers</li>
              <li>Click "Predict" to generate the Q4 forecast</li>
            </ul>
          </div>
          
          <div className="input-group">
            <div className="input-wrapper">
              <label htmlFor="Q1">Quartile 1 Demand</label>
              <input type="number" id="Q1" name="Q1" className="input-field" value={quartileInputs.Q1} onChange={handleChange} placeholder="Enter Q1 value" />
            </div>
            <div className="input-wrapper">
              <label htmlFor="Q2">Quartile 2 Demand</label>
              <input type="number" id="Q2" name="Q2" className="input-field" value={quartileInputs.Q2} onChange={handleChange} placeholder="Enter Q2 value" />
            </div>
            <div className="input-wrapper">
              <label htmlFor="Q3">Quartile 3 Demand</label>
              <input type="number" id="Q3" name="Q3" className="input-field" value={quartileInputs.Q3} onChange={handleChange} placeholder="Enter Q3 value" />
            </div>
          </div>
          
          <button className="predict-button" onClick={handlePredict} disabled={loading}>
            {loading ? "Calculating..." : "Predict Q4 Demand"}
          </button>
        </div>
        
        <div className="card result-card">
          <h2 className="card-title">Prediction Results</h2>
          
          {prediction !== null ? (
            <div className="prediction-result">
              <div className="prediction-value">
                <span className="prediction-label">Q4 Predicted Demand:</span>
                <span className="prediction-number">{prediction}</span>
              </div>
            </div>
          ) : (
            <p className="result-text">Fill in the quartile demands and click "Predict" to see results.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShrimpDemandPrediction;
