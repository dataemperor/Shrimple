import React, { useState } from "react";
import "../styles/predict.css";
import { Droplet, FlaskConical, Waves, Eye, AlignLeft } from "lucide-react";
import bgImage from "../assests/back1.jpg"; // Fixed "assets" typo

function Predict() {
  const [formData, setFormData] = useState({
    doc: "",
    ph: "",
    salinity: "",
    transparency: "",
    alkalinity: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        console.log("Sending Data to API:", formData); // Debugging

        const response = await fetch("http://localhost:5000/save-prediction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        console.log("Received Response:", result); // Debugging

        if (result.error) throw new Error(result.error);

        setPrediction(result.prediction);
    } catch (error) {
        setError("Failed to save prediction. Please try again.");
        console.error("Error:", error);
    } finally {
        setLoading(false);
    }
};

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Predict;
