import joblib
import flask
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import datetime
import numpy as np
import shap  # For feature importance

# Initialize Flask app
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Shrimp Prediction API!"})

# Load the trained model for prediction and anomaly detection
model = joblib.load('random_forest_model.pkl')
anomaly_detection_model = joblib.load('anomaly_detection.pkl')

# MongoDB connection URI
uri = "mongodb+srv://shrimple:123shrimple@shrimple.ar5le.mongodb.net/?retryWrites=true&w=majority&appName=shrimple"

# Error handling for MongoDB connection
try:
    client = MongoClient(uri)
    client.server_info()  # Will throw an error if connection fails
    print("MongoDB connected successfully")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

db = client.shrimple
predictions_collection = db.predictions


# Route to handle prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from the frontend request
        data = request.get_json()

        # Validate input data
        if not all(k in data for k in ('doc', 'ph', 'salinity', 'transparency', 'alkalinity')):
            return jsonify({'error': 'Missing required fields'}), 400

        # Validate location data
        location = data.get('location', None)  # Optional location field
        if location and ('latitude' not in location or 'longitude' not in location):
            return jsonify({'error': 'Location data is incomplete'}), 400

        # Convert inputs to float
        doc = float(data['doc'])
        ph = float(data['ph'])
        salinity = float(data['salinity'])
        transparency = float(data['transparency'])
        alkalinity = float(data['alkalinity'])
        
        # Anomaly Detection 
        features_anomaly = np.array([[doc, ph, salinity, transparency, alkalinity]])
        is_anomaly = anomaly_detection_model.predict(features_anomaly)[0]
        anomaly_detection_score = anomaly_detection_model.decision_function(features_anomaly)[0]

        if is_anomaly == 1:
            return jsonify({
                'anomaly_detected': True,
                'anomaly_detection_score': anomaly_detection_score
            }), 200

        if doc<3:
            return jsonify({'prediction':'Unbreedable Shrimp Zone','reason':'DOC is below the acceptable threshold'}), 200


        # Define hard reject ranges (extreme values)
        hard_limits = {
            "ph": (6, 10),
            "salinity": (0, 40),
            "transparency": (6, 80),
            "alkalinity": (70, 500),
        }

        # Check if any input is completely unrealistic
        for param, (min_limit, max_limit) in hard_limits.items():
            if locals()[param] < min_limit or locals()[param] > max_limit:
                return jsonify({'prediction': 'Non-Harvestable Shrimp Zone', 'reason': f'{param} is completely out of range'}), 200

        

        # Prepare data for model prediction
        features = np.array([[doc, ph, salinity, transparency, alkalinity]])

        # Predict using the trained model
        prediction = model.predict(features)[0]
        prediction_label = "Harvestable Shrimp Zone" if prediction == 1 else "Non-Harvestable Shrimp Zone"

        # Calculate feature importance dynamically (using SHAP)
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(features)
        feature_importance = shap_values[0].tolist()  # SHAP values for the input

        # Record user input and prediction result in MongoDB
        prediction_data = {
            'doc': doc,
            'ph': ph,
            'salinity': salinity,
            'transparency': transparency,
            'alkalinity': alkalinity,
            'prediction': prediction_label,
            'location': location,  # Add location to the MongoDB record
            'createdAt': datetime.datetime.now()
        }
        # Error handling for MongoDB insert
        try:
            predictions_collection.insert_one(prediction_data)
            print("Prediction saved to MongoDB")
        except Exception as e:
            print(f"Error saving prediction to MongoDB: {e}")
            return jsonify({'error': 'Failed to save prediction to the database'}), 500

        print("Content-Type received:", request.headers.get("Content-Type"))

        # Return the prediction result with feature importance
        return jsonify({
            'prediction': prediction_label,
            'confidence': max(model.predict_proba(features)[0]) * 100,  # Confidence in percentage
            'graph_data': {
                'labels': ['DOC', 'pH', 'Salinity', 'Transparency', 'Alkalinity'],
                'values': feature_importance
            },
            'anomaly_detected': bool(is_anomaly),
            'anomaly_detection_score': anomaly_detection_score
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)
