import React, { useState, useEffect, useRef } from "react";
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from "chart.js";
import { Droplet, FlaskConical, Waves, Eye, AlignLeft, Sparkles, MapPin,CompassIcon, ArrowRightIcon, CheckCircleIcon, Loader2Icon, LocateIcon} from "lucide-react";
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
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const chartRef = useRef(null);
  const suggestionsRef = useRef(null);
  const searchInputRef = useRef(null);
  const [anomalyDetected, setAnomalyDetected] = useState(false);
  const [anomalyScore, setAnomalyScore] = useState(null);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  // Improved autocomplete with debouncing
  const handleSearchInputChange = async (e) => {
    const input = e.target.value;
    setSearchTerm(input);

    if (input.length > 2) {
      setIsSearching(true);
      
      // Debounce the API call
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(async () => {
        try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&addressdetails=1&limit=5`;
          const response = await fetch(url);
          const data = await response.json();

          setSuggestions(
            data.map((item) => ({
              displayName: item.display_name,
              lat: item.lat,
              lon: item.lon,
              mainName: item.display_name.split(',')[0],
              details: item.display_name.split(',').slice(1).join(', ').trim()
            }))
          );
        } catch (error) {
          console.error("Error fetching autocomplete suggestions:", error);
          toast.error("Could not fetch location suggestions");
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation({
      latitude: parseFloat(suggestion.lat).toFixed(6),
      longitude: parseFloat(suggestion.lon).toFixed(6),
    });
    setSearchTerm(suggestion.displayName);
    setSuggestions([]);
    
    // Add a success toast
    toast.success("Location selected successfully", {
      description: suggestion.mainName,
      icon: <CheckCircleIcon className="text-green-500" />
    });
  };

  const autofillCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.info("Fetching your location...", {
        icon: <Loader2Icon className="animate-spin" />
      });
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lon = position.coords.longitude.toFixed(6);
          
          setLocation({
            latitude: lat,
            longitude: lon,
          });
          
          // Perform reverse geocoding to get address
          try {
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data && data.display_name) {
              setSearchTerm(data.display_name);
              toast.success("Current location detected", {
                description: data.display_name.split(',')[0],
                icon: <MapPin />
              });
            } else {
              toast.success("Location coordinates updated");
            }
          } catch (error) {
            console.error("Error in reverse geocoding:", error);
            toast.success("Location coordinates updated");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const adjustedFormData = { ...formData };
    for (const [key, value] of Object.entries(adjustedFormData)) {
      if (value === "") {
        adjustedFormData[key] = "0";
      }
    }

    const filledFields = Object.entries(adjustedFormData).filter(([_, value]) => value !== "0");

    if (filledFields.length < 3) {
      setError("Please fill in at least 3 fields to proceed with the prediction.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...adjustedFormData,
        location, // Include selected location
      };

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      setPrediction(result.prediction);
      setConfidence(result.confidence || 95);
      setGraphData({
        labels: result.graph_data?.labels || ["DO", "pH", "Salinity", "Transparency", "Alkalinity"],
        datasets: [
          {
            label: "Feature Importance",
            data: result.graph_data?.values || [0.25, 0.2, 0.3, 0.15, 0.1],
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
                grid: { color: "rgba(0, 0, 0, 0.05)" },
                ticks: { font: { size: 11 } }
              },
              x: { 
                grid: { display: false },
                ticks: { font: { size: 11 } }
              },
            },
            animation: { duration: 2000, easing: "easeOutQuart" },
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
          {/* Prediction Form Section */}
          <div className="predict-form-card">
            <div className="predict-form-header">
              <Sparkles className="icon-sparkle" />
              <h2 className="predict-form-title">Water Parameters</h2>
            </div>
  
            <form className="predict-form" onSubmit={(e) => e.preventDefault()}>
              {/* Display error messages */}
              {error && <div className="error-message">{error}</div>}
  
              {/* Input Fields for Parameters */}
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
  
              {/* Location Search Input */}
              <div className="input-group">
                <label className="input-label">Search for a Location</label>
                <div className="input-wrapper" ref={searchInputRef}>
                  <MapPin className="input-icon" />
                  <input
                    type="text"
                    name="place"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    placeholder="Enter a location (e.g., Jaffna Fort)"
                    className="input-field"
                  />
                  {isSearching && (
                    <div className="loading-spinner mr-2" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                  )}
                </div>

                {/* Suggestions Dropdown */}
                <div className="suggestions-container" ref={suggestionsRef}>
                  {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <span className="suggestion-name">
                            {suggestion.mainName}
                          </span>
                          <span className="suggestion-details">
                            {suggestion.details}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
  
              {/* Latitude and Longitude Inputs */}
              <div className="location-input-group">
                <div className="location-input-wrapper">
                  <label className="location-input-label">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={location.latitude}
                    onChange={handleLocationChange}
                    placeholder="Enter Latitude"
                    className="location-input-field"
                    step="0.000001"
                  />
                </div>
                <div className="location-input-wrapper">
                  <label className="location-input-label">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={location.longitude}
                    onChange={handleLocationChange}
                    placeholder="Enter Longitude"
                    className="location-input-field"
                    step="0.000001"
                  />
                </div>
              </div>
  
              {/* Location Buttons */}
              <button
                type="button"
                className="location-btn"
                onClick={autofillCurrentLocation}
              >
                <LocateIcon size={18} />
                Use My Current Location
              </button>
  
              {/* Predict Button */}
              <button 
                className="predict-button" 
                onClick={handlePredict} 
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-indicator">
                    <span className="loading-spinner"></span>
                    Processing...
                  </span>
                ) : (
                  <>
                    Predict Harvest
                    <ArrowRightIcon className="button-icon" size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
  
          {/* Prediction Results Section */}
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
  
                  {/* Display Confidence */}
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
  
                  {/* Display selected location */}
                  {location.latitude && location.longitude && (
                    <div className="location-info">
                      <h4 className="location-label">
                        <MapPin size={18} /> Selected Location
                      </h4>
                      {searchTerm && <p className="location-full-address">{searchTerm}</p>}
                      <p><strong>Latitude:</strong> {location.latitude}</p>
                      <p><strong>Longitude:</strong> {location.longitude}</p>
                    </div>
                  )}
                </div>
  
                {/* Display Chart */}
                {graphData && (
                  <div className="chart-container">
                    <h3 className="chart-title">Feature Importance</h3>
                    <canvas id="featureChart"></canvas>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <CompassIcon size={48} className="empty-icon" />
                <h3 className="empty-title">No Prediction Yet</h3>
                <p className="empty-text">
                  Fill in the water parameters and click "Predict Harvest" to see results.
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
