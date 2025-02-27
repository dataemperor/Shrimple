import { useState } from "react";

function PredictGroundPage() {
  const [formData, setFormData] = useState({
    doc: "",
    ph: "",
    salinity: "",
    transparency: "",
    alkalinity: "",
  })
  const [prediction, setPrediction] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log("PredictionPage is rendering");


  // Simulate prediction fetch
  const handlePredict = () => {
    const randomScore = Math.floor(Math.random() * 10) + 1;
    setPrediction(`Prediction Score: ${randomScore} / 10 ✅`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-center text-2xl font-semibold mb-4">
          Shrimp Harvest Prediction
        </h2>

        {/* Input Fields */}
        <div className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {key}
              </label>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
          ))}

          {/* Predict Button */}
          <button
            className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            onClick={handlePredict}
          >
            Predict
          </button>

          {/* Display Prediction */}
          {prediction && (
            <div className="mt-4 p-3 text-center text-lg font-semibold bg-blue-100 text-blue-700 rounded-md">
              {prediction}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PredictGroundPage;
