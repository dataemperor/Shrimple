require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const joblib = require("joblib");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Define Schema & Model
const predictionSchema = new mongoose.Schema({
    doc: Number,
    ph: Number,
    salinity: Number,
    transparency: Number,
    alkalinity: Number,
    prediction: Number, // Store the prediction result in DB
    createdAt: { type: Date, default: Date.now },
});

const Prediction = mongoose.model("Prediction", predictionSchema);

// Load Random Forest Model (make sure the file is in the right path)
const rfModel = joblib.load('random_forest_model.pkl');

// API Route to Save Data and Make Prediction
app.post("/predict", async (req, res) => {
    try {
        const { doc, ph, salinity, transparency, alkalinity } = req.body;

        // Validate inputs
        if (!doc || !ph || !salinity || !transparency || !alkalinity) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Prepare input for the model (convert to an array format that the model expects)
        const inputFeatures = [[doc, ph, salinity, transparency, alkalinity]];

        // Make prediction using the Random Forest model
        const prediction = rfModel.predict(inputFeatures);

        // Save the prediction and inputs to MongoDB
        const newPrediction = new Prediction({
            doc,
            ph,
            salinity,
            transparency,
            alkalinity,
            prediction: prediction[0], // Store the predicted result
        });

        await newPrediction.save();

        res.json({ prediction: prediction[0] });

    } catch (error) {
        console.error("Prediction error:", error);
        res.status(500).json({ error: "Server error during prediction" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
