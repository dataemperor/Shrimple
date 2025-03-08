import React, { useState, useEffect, useRef } from "react";
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from "chart.js";
import { Droplet, FlaskConical, Waves, Eye, AlignLeft, ArrowRight, Sparkles } from "lucide-react";
import "../styles/predict.css";
import { toast } from "sonner";

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
  const chartRef = useRef(null); // Create a ref for the chart

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Fill empty fields with 0
    const adjustedFormData = { ...formData };
    for (const [key, value] of Object.entries(adjustedFormData)) {
        if (value === "") {
            adjustedFormData[key] = "0"; // Assign default value of 0 for empty fields
        }
    }

    // Count the number of filled (non-zero) fields
    const filledFields = Object.entries(adjustedFormData).filter(([_, value]) => value !== "0");


    // Check if at least 3 fields are filled
    if (filledFields.length < 3) {
      setError("Please fill in at least 3 fields to proceed with the prediction.");
      setLoading(false);
      return;
    }

    // Validate that entered fields have numeric values
    const invalidFields = filledFields.filter(([_, value]) => isNaN(Number(value)));
    if (invalidFields.length > 0) {
      setError("Please enter valid numeric values for all fields you fill in.");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending Data to API:", adjustedFormData); // Debugging

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adjustedFormData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Received Response:", result); // Debugging

      if (result.error) throw new Error(result.error);

      setPrediction(result.prediction);
      setConfidence(result.confidence || 95); // Fallback if confidence is not returned
      setGraphData({
        labels: result.graph_data?.labels || ["DO", "pH", "Salinity", "Transparency", "Alkalinity"],
        datasets: [
          {
            label: "Feature Importance",
            data: result.graph_data?.values || [0.25, 0.20, 0.30, 0.15, 0.10],
            backgroundColor: ["#FF7F30", "#FF9F5A", "#4AEADC", "#168077", "#FFC107"],
          },
        ],
      });
      toast.success("Prediction completed successfully!");
    } catch (error) {
      setError("Failed to fetch prediction. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Destroy the old chart instance before creating a new one
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (graphData && document.getElementById("featureChart")) {
      const canvas = document.getElementById("featureChart");
      if (canvas instanceof HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        chartRef.current = new Chart(ctx, {
          type: "bar",
          data: graphData,
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                titleColor: "#333",
                bodyColor: "#333",
                borderColor: "#ddd",
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                padding: 12,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
            animation: {
              duration: 2000,
              easing: "easeOutQuart",
            },
          },
        });
      }
    }
  }, [graphData]);

  const inputFields = [
    { name: "doc", label: "Dissolved Oxygen (mg/L)", icon: <Droplet className="input-icon" /> },
    { name: "ph", label: "pH Level", icon: <FlaskConical className="input-icon" /> },
    { name: "salinity", label: "Salinity (ppt)", icon: <Waves className="input-icon" /> },
    { name: "transparency", label: "Water Transparency (cm)", icon: <Eye className="input-icon" /> },
    { name: "alkalinity", label: "Alkalinity (mg/L)", icon: <AlignLeft className="input-icon" /> },
  ];

  return (
    <div className="predict-container">
      <div className="predict-content">
        <div className="predict-header">
          <h1 className="predict-main-title">Shrimp Harvest Predictor</h1>
          <p className="predict-subtitle">Enter water parameters to predict harvest outcomes</p>
        </div>

        <div className="predict-grid">
          <div className="predict-form-card">
            <div className="predict-form-header">
              <Sparkles className="icon-sparkle" />
              <h2 className="predict-form-title">Water Parameters</h2>
            </div>

            <form className="predict-form">
              {error && <div className="error-message">{error}</div>} {/* Display the error message */}
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
                      step="0.01"
                    />
                  </div>
                </div>
              ))}

              <button
                className="predict-button"
                onClick={handlePredict}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-text">Processing</span>
                ) : (
                  <>
                    <span>Predict Harvest</span>
                    <ArrowRight className="button-icon" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="results-card">
            {prediction !== null ? (
              <>
                <div className="results-header">
                  <h2 className="results-title">Prediction Results</h2>
                </div>

                <div className="prediction-result">
                  <div className="prediction-value">
                    <span className="prediction-label">Predicted Harvest</span>
                    <span className="prediction-number">{prediction}</span>
                  </div>

                  {confidence && (
                    <div className="confidence-meter">
                      <div className="confidence-header">
                        <span className="confidence-label">Confidence</span>
                        <span className="confidence-value">{confidence}%</span>
                      </div>
                      <div className="confidence-bar">
                        <div
                          className="confidence-fill"
                          style={{ width: `${confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {graphData && (
                  <div className="chart-container">
                    <h3 className="chart-title">Feature Importance</h3>
                    <canvas id="featureChart"></canvas>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3 className="empty-title">No Prediction Yet</h3>
                <p className="empty-text">
                  Fill in the water parameters and click "Predict Harvest" to see results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Predict;
