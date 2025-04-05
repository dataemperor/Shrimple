import React, { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./components/ShrimpDemand.css";

const ShrimpDemandPrediction = () => {
  const [quartileInputs, setQuartileInputs] = useState({
    Q1: "",
    Q2: "",
    Q3: ""
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  const handleChange = (e) => {
    setQuartileInputs({ ...quartileInputs, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (prediction !== null) {
      updateChartData();
    }
  }, [prediction]);

  const updateChartData = () => {
    const newChartData = [
      { name: "Q1", value: Number(quartileInputs.Q1) },
      { name: "Q2", value: Number(quartileInputs.Q2) },
      { name: "Q3", value: Number(quartileInputs.Q3) },
      { name: "Q4 (Predicted)", value: prediction }
    ];
    setChartData(newChartData);
  };

  const handlePredict = () => {
    if (!quartileInputs.Q1 || !quartileInputs.Q2 || !quartileInputs.Q3) {
      alert("Please fill in all three quartile values");
      return;
    }

    setLoading(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      const lag1 = Number(quartileInputs.Q3);
      const lag2 = Number(quartileInputs.Q2);
      const rollingMean = (Number(quartileInputs.Q1) + Number(quartileInputs.Q2) + Number(quartileInputs.Q3)) / 3;
      
      // Using weighted prediction algorithm from reference code
      const mockPrediction = Math.round((lag1 * 0.5) + (lag2 * 0.2) + (rollingMean * 0.3) * 1.05);
      
      setPrediction(mockPrediction);
      setLoading(false);
    }, 1000);
  };

  const getQuarterlyTrend = () => {
    if (!chartData.length) return "";
    
    const q3 = Number(quartileInputs.Q3);
    
    if (prediction > q3) {
      return "Demand is trending upward for Q4";
    } else if (prediction < q3) {
      return "Demand is trending downward for Q4";
    } else {
      return "Demand is stable for Q4";
    }
  };

  const getGrowthPercentage = () => {
    if (!chartData.length) return "";
    
    const q3 = Number(quartileInputs.Q3);
    if (q3 === 0) return "N/A";
    
    const growthPercent = ((prediction - q3) / q3 * 100).toFixed(1);
    return `${growthPercent}%`;
  };

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
              <label htmlFor="Q1">Quartile 1 Demand (Low season)</label>
              <input type="number" id="Q1" name="Q1" className="input-field" value={quartileInputs.Q1} onChange={handleChange} placeholder="Enter Q1 value" />
            </div>
            <div className="input-wrapper">
              <label htmlFor="Q2">Quartile 2 Demand (Moderate season)</label>
              <input type="number" id="Q2" name="Q2" className="input-field" value={quartileInputs.Q2} onChange={handleChange} placeholder="Enter Q2 value" />
            </div>
            <div className="input-wrapper">
              <label htmlFor="Q3">Quartile 3 Demand (High season)</label>
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
            <div className="prediction-results">
              <div className="prediction-value">
                <span className="prediction-label">Q4 Predicted Demand:</span>
                <span className="prediction-number">{prediction}</span>
              </div>
              
              <div className="prediction-stats">
                <div className="stat-item">
                  <span className="stat-label">Growth from Q3:</span>
                  <span className="stat-value">{getGrowthPercentage()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Trend:</span>
                  <span className="stat-value">{getQuarterlyTrend()}</span>
                </div>
              </div>
              
              <div className="charts-container">
                <div className="chart-wrapper">
                  <h3 className="chart-title">Quarterly Demand Trend</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#f97316" 
                        activeDot={{ r: 8 }} 
                        name="Demand"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="chart-wrapper">
                  <h3 className="chart-title">Quarterly Demand Comparison</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        fill="#1c4a42" 
                        name="Demand" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
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