import React, { useState, useEffect, useRef } from "react";
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from "chart.js";
import { Droplet, FlaskConical, Waves, Eye, AlignLeft } from "lucide-react";
import bgImage from "../assests/back1.jpg";
import "../styles/predict.css"; // Import external CSS
import ErrorBoundary from "./ErrorBoundary";  // Import the Error Boundary

// Register the required components with Chart.js
Chart.register(CategoryScale, LinearScale, BarController, BarElement);

function Predict() {
  const [formData, setFormData] = useState({
    doc: "",
    ph: "",
    salinity: "",
    transparency: "",
    alkalinity: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);  // Create a ref for the chart

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result.error) throw new Error(result.error);

      setPrediction(result.prediction);
      setConfidence(result.confidence);
      setGraphData({
        labels: result.graph_data.labels,
        datasets: [
          {
            label: "Feature Importance",
            data: result.graph_data.values,
            backgroundColor: ["#4CAF50", "#2196F3", "#FF5722", "#FFC107", "#9C27B0"]
          }
        ]
      });
    } catch (error) {
      setError("Failed to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Destroy the old chart instance before creating a new one
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    if (graphData) {
      const ctx = document.getElementById("myChart").getContext("2d");
      chartRef.current = new Chart(ctx, {
        type: "bar",
        data: graphData,
        options: {
          responsive: true,
          plugins: {
            legend: { display: true, position: "top" },
          },
        },
      });
    }
  }, [graphData]);

  const inputFields = [
    { name: "doc", label: "Dissolved Oxygen", icon: <Droplet className="input-icon" /> },
    { name: "ph", label: "pH Level", icon: <FlaskConical className="input-icon" /> },
    { name: "salinity", label: "Salinity", icon: <Waves className="input-icon" /> },
    { name: "transparency", label: "Water Transparency", icon: <Eye className="input-icon" /> },
    { name: "alkalinity", label: "Alkalinity", icon: <AlignLeft className="input-icon" /> },
  ];

  const pageStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  };

  return (
    <div className="predict-container" style={pageStyle}>
      <ErrorBoundary>  {/* Wrap your component tree with ErrorBoundary */}
        <div className="predict-card">
          <h2 className="predict-title">Shrimp Harvest Prediction</h2>

          <div className="form-group">
            {inputFields.map(({ name, label, icon }) => (
              <div key={name} className="input-group">
                <label className="input-label">{label}</label>
                <div className="input-wrapper">
                  {icon}
                  <input
                    type="number"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={`Enter ${label}`}
                    className="input-field"
                  />
                </div>
              </div>
            ))}

            <button className="predict-button" onClick={handlePredict} disabled={loading}>
              {loading ? "Predicting..." : "Predict"}
            </button>

            {error && <p className="error-message">{error}</p>}

            {prediction !== null && (
              <div className="prediction-result">
                <strong>Predicted Output:</strong> {prediction}
                <p><strong>Confidence:</strong> {confidence}%</p>
              </div>
            )}

            {graphData && (
              <div className="graph-container">
                <h3>Feature Importance</h3>
                <canvas id="myChart"></canvas>
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default Predict;
