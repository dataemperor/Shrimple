import React, { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../styles/ShrimpDemand.css";

const ShrimpDemandPrediction = () => {
  const [quartileInputs, setQuartileInputs] = useState({
    Q1: "",
    Q2: "",
    Q3: ""
  });
  const [errors, setErrors] = useState({
    Q1: "",
    Q2: "",
    Q3: "",
    general: ""
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  // Industry standard ranges for validation
  const VALIDATION_RULES = {
    minValue: 0, // Non-negative values only
    maxValue: 1000000, // Upper limit to prevent unrealistic values
    seasonalRules: [
      { quarter: "Q1", maxIncreaseFromPrevious: 20 }, // Q1 typically has slower growth from Q4
      { quarter: "Q2", maxIncreaseFromPrevious: 30 }, // Q2 can have moderate growth from Q1
      { quarter: "Q3", maxIncreaseFromPrevious: 50 }  // Q3 can have higher growth from Q2 (peak season)
    ],
    maxSeasonalVariation: 80, // Maximum percent variation between quarters
    outlierDeviation: 2.5 // Standard deviations for outlier detection
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: "", general: "" }));

    // Allow empty fields or valid numbers
    if (value === "" || !isNaN(Number(value))) {
      setQuartileInputs({ ...quartileInputs, [name]: value });
    }
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

  const validateInputs = () => {
    const newErrors = { Q1: "", Q2: "", Q3: "", general: "" };
    let isValid = true;

    // Check if inputs are provided
    if (!quartileInputs.Q1 || !quartileInputs.Q2 || !quartileInputs.Q3) {
      newErrors.general = "Please fill in all three quartile values";
      isValid = false;
    }

    const q1 = Number(quartileInputs.Q1);
    const q2 = Number(quartileInputs.Q2);
    const q3 = Number(quartileInputs.Q3);

    // Check if values are within reasonable ranges
    if (q1 < VALIDATION_RULES.minValue) {
      newErrors.Q1 = `Value cannot be negative`;
      isValid = false;
    } else if (q1 > VALIDATION_RULES.maxValue) {
      newErrors.Q1 = `Value exceeds maximum limit of ${VALIDATION_RULES.maxValue.toLocaleString()}`;
      isValid = false;
    }

    if (q2 < VALIDATION_RULES.minValue) {
      newErrors.Q2 = `Value cannot be negative`;
      isValid = false;
    } else if (q2 > VALIDATION_RULES.maxValue) {
      newErrors.Q2 = `Value exceeds maximum limit of ${VALIDATION_RULES.maxValue.toLocaleString()}`;
      isValid = false;
    }

    if (q3 < VALIDATION_RULES.minValue) {
      newErrors.Q3 = `Value cannot be negative`;
      isValid = false;
    } else if (q3 > VALIDATION_RULES.maxValue) {
      newErrors.Q3 = `Value exceeds maximum limit of ${VALIDATION_RULES.maxValue.toLocaleString()}`;
      isValid = false;
    }

    // Seasonal validation - Q2 is typically higher than Q1
    if (q1 > 0 && q2 > 0 && q1 > q2) {
      newErrors.Q2 = `Q2 demand is typically higher than Q1 (low season)`;
      isValid = false;
    }

    // Seasonal validation - Q3 is typically the highest (peak season)
    if ((q1 > q3 || q2 > q3) && q3 > 0) {
      newErrors.Q3 = `Q3 is typically the peak season with highest demand`;
      isValid = false;
    }

    // Check for unrealistic variations between quarters
    if (q1 > 0 && q2 > 0) {
      const q1q2Variation = Math.abs((q2 - q1) / q1 * 100);
      if (q1q2Variation > VALIDATION_RULES.maxSeasonalVariation) {
        newErrors.Q2 = `Variation from Q1 (${q1q2Variation.toFixed(1)}%) exceeds typical seasonal changes`;
        isValid = false;
      }
    }

    if (q2 > 0 && q3 > 0) {
      const q2q3Variation = Math.abs((q3 - q2) / q2 * 100);
      if (q2q3Variation > VALIDATION_RULES.maxSeasonalVariation) {
        newErrors.Q3 = `Variation from Q2 (${q2q3Variation.toFixed(1)}%) exceeds typical seasonal changes`;
        isValid = false;
      }
    }

    // Outlier detection using standard deviation
    if (q1 > 0 && q2 > 0 && q3 > 0) {
      const values = [q1, q2, q3];
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
      const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
      const stdDev = Math.sqrt(variance);

      values.forEach((val, index) => {
        const quarterName = `Q${index + 1}`;
        const zScore = Math.abs((val - mean) / stdDev);

        if (zScore > VALIDATION_RULES.outlierDeviation) {
          newErrors[quarterName] = `This value appears to be an outlier (${zScore.toFixed(1)} standard deviations from mean)`;
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePredict = () => {
    // Reset errors
    setErrors({ Q1: "", Q2: "", Q3: "", general: "" });

    // Validate inputs
    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      const q1 = Number(quartileInputs.Q1);
      const q2 = Number(quartileInputs.Q2);
      const q3 = Number(quartileInputs.Q3);

      // Calculate seasonal factors
      const q1ToQ2Growth = (q2 - q1) / q1;
      const q2ToQ3Growth = (q3 - q2) / q2;
      const avgSeasonalGrowth = (q1ToQ2Growth + q2ToQ3Growth) / 2;

      // Base algorithm with weighted factors
      const lag1 = q3; // Most recent quarter has highest weight
      const lag2 = q2;
      const rollingMean = (q1 + q2 + q3) / 3;

      // Industry standard calculations include:
      // 1. Recent quarter trends (last 1-2 quarters)
      // 2. Rolling averages for baseline
      // 3. Seasonal adjustment factors
      // 4. Industry growth trends (~5% annual growth in shrimp market)

      // Calculate base prediction with weighted factors
      let mockPrediction = Math.round((lag1 * 0.5) + (lag2 * 0.2) + (rollingMean * 0.3) * 1.05);

      // Apply seasonal adjustment if Q4 is typically lower than Q3
      // In shrimp industry, Q4 is often 5-15% lower than Q3 peak
      mockPrediction = Math.round(mockPrediction * 0.92); // Apply 8% reduction for Q4 seasonal factor

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

      <div className="content-container">
        <div className="card input-card">
          <h2 className="card-title">Quartile Demands</h2>

          <div className="instructions">
            <h3>How to Use This Tool</h3>
            <p>This tool predicts shrimp demand for the next quartile based on historical data and industry standards.</p>
            <ul>
              <li>Enter the shrimp demand values for the last three quartiles</li>
              <li>Values should follow typical seasonal patterns (Q1 lowest, Q3 highest)</li>
              <li>Large variations between quarters may trigger validation warnings</li>
              <li>Click "Predict" to generate the Q4 forecast</li>
            </ul>
          </div>

          {errors.general && <div className="error-message">{errors.general}</div>}

          <div className="input-group">
            <div className="input-wrapper">
              <label htmlFor="Q1">Quartile 1 Demand (Low season)</label>
              <input
                type="number"
                id="Q1"
                name="Q1"
                className={`input-field ${errors.Q1 ? 'input-error' : ''}`}
                value={quartileInputs.Q1}
                onChange={handleChange}
                placeholder="Enter Q1 value"
              />
              {errors.Q1 && <div className="error-text">{errors.Q1}</div>}
            </div>
            <div className="input-wrapper">
              <label htmlFor="Q2">Quartile 2 Demand (Moderate season)</label>
              <input
                type="number"
                id="Q2"
                name="Q2"
                className={`input-field ${errors.Q2 ? 'input-error' : ''}`}
                value={quartileInputs.Q2}
                onChange={handleChange}
                placeholder="Enter Q2 value"
              />
              {errors.Q2 && <div className="error-text">{errors.Q2}</div>}
            </div>
            <div className="input-wrapper">
              <label htmlFor="Q3">Quartile 3 Demand (High season)</label>
              <input
                type="number"
                id="Q3"
                name="Q3"
                className={`input-field ${errors.Q3 ? 'input-error' : ''}`}
                value={quartileInputs.Q3}
                onChange={handleChange}
                placeholder="Enter Q3 value"
              />
              {errors.Q3 && <div className="error-text">{errors.Q3}</div>}
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
