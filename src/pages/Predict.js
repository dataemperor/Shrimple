import React, { useState } from "react";
import "../styles/predict.css";
import { Droplet, FlaskConical, Waves, Eye, AlignLeft } from "lucide-react";
import bgImage from "../assests/backroundShrimp.jpg"; // Fixed import

function Predict() {
  const [formData, setFormData] = useState({
    doc: "",
    ph: "",
    salinity: "",
    transparency: "",
    alkalinity: "",
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      setPrediction(result.prediction);
    } catch (error) {
      console.error("Error:", error);
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

          <button className="predict-button" onClick={handlePredict}>
            Predict
          </button>

          {prediction && (
            <div className="prediction-result">
              {prediction}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Predict;
