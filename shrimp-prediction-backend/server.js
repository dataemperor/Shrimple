require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios"); // Use axios for HTTP requests

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
    prediction: String, // Store the prediction result as a string
    createdAt: { type: Date, default: Date.now },
});

const Prediction = mongoose.model("Prediction", predictionSchema);

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the Shrimp Prediction API!");
});

// API Route to Save Data and Make Prediction
app.post("/predict", async (req, res) => {
    try {
        const { doc, ph, salinity, transparency, alkalinity } = req.body;

        // Validate inputs
        if (!doc || !ph || !salinity || !transparency || !alkalinity) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Call the Flask service for prediction
        const response = await axios.post('http://127.0.0.1:5001/predict', {
            doc, ph, salinity, transparency, alkalinity
        });

        const predictionLabel = response.data.prediction;

        // Save the prediction and inputs to MongoDB
        const newPrediction = new Prediction({
            doc,
            ph,
            salinity,
            transparency,
            alkalinity,
            prediction: predictionLabel, // Store the predicted result as a string
        });

        await newPrediction.save();

        res.json({ prediction: predictionLabel });

    } catch (error) {
        console.error("Prediction error:", error);
        res.status(500).json({ error: "Server error during prediction" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
