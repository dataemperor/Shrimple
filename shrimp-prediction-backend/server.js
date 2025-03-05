require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Define Schema & Model
const predictionSchema = new mongoose.Schema({
    doc: Number,
    ph: Number,
    salinity: Number,
    transparency: Number,
    alkalinity: Number,
    createdAt: { type: Date, default: Date.now }
});

const Prediction = mongoose.model("Prediction", predictionSchema);

// API Route to Save Data
app.post("/save-prediction", async (req, res) => {
    try {
        console.log("Received Data:", req.body); // Debugging

        if (!req.body.doc || !req.body.ph || !req.body.salinity || !req.body.transparency || !req.body.alkalinity) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newPrediction = new Prediction({
            doc: req.body.doc,
            ph: req.body.ph,
            salinity: req.body.salinity,
            transparency: req.body.transparency,
            alkalinity: req.body.alkalinity,
        });

        await newPrediction.save();
        console.log("✅ Data saved successfully!");
        res.status(201).json({ message: "✅ Prediction Data Saved Successfully" });
    } catch (error) {
        console.error("❌ Error saving prediction:", error);
        res.status(500).json({ error: "❌ Error saving prediction data" });
    }
});

app.post("/predict", async (req, res) => {
    try {
        const { doc, ph, salinity, transparency, alkalinity } = req.body;
        
        // Validate inputs
        if (!doc || !ph || !salinity || !transparency || !alkalinity) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Simulate a prediction response (Replace with ML model logic)
        const predictionResult = (doc + ph + salinity + transparency + alkalinity) / 5;

        res.json({ prediction: predictionResult });
    } catch (error) {
        console.error("Prediction error:", error);
        res.status(500).json({ error: "Server error during prediction" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));