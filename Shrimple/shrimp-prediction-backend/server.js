require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors({
    origin: "http://localhost:5173", // Allow specific frontend origin
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)

    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// User Schema & Model
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String, 
});

const User = mongoose.model("User", userSchema);

// Prediction Schema & Model
const predictionSchema = new mongoose.Schema({
    doc: Number,
    ph: Number,
    salinity: Number,
    transparency: Number,
    alkalinity: Number,
    prediction: String,
    location: {
        latitude: Number,
        longitude: Number,
    },
    createdAt: { type: Date, default: Date.now },
});

const Prediction = mongoose.model("Prediction", predictionSchema);

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the Shrimp Prediction API!");
});

// **User Signup**
app.post("/signup", async (req, res) => {
    console.log("Request received at /signup");
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// **User Signin**
app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({ message: "Login successful", userId: user._id, name: user.name });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// **Prediction Route**
app.post("/predict", async (req, res) => {
    try {
        const {  doc, ph, salinity, transparency, alkalinity, location } = req.body;

        // Validate inputs
        if (!doc || !ph || !salinity || !transparency || !alkalinity) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Call the Flask service for prediction
        const response = await axios.post('http://127.0.0.1:5001/predict', {
            doc, ph, salinity, transparency, alkalinity, location,
        });

        const { prediction, confidence, graph_data } = response.data;

        // Save the prediction and inputs to MongoDB
        const newPrediction = new Prediction({
            doc,
            ph,
            salinity,
            transparency,
            alkalinity,
            prediction,
            location,
        });

        await newPrediction.save();

        res.json({ prediction, confidence, graph_data });

    } catch (error) {
        console.error("Prediction error:", error);
        res.status(500).json({ error: "Server error during prediction" });
    }
});

// Start Server
// Changing the port from 5000 to 5001 in order to run server.py and server.js together at the same time
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
