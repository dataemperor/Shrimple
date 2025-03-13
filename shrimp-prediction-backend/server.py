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

# Load the trained model
model = joblib.load('random_forest_model.pkl')

# Connect to MongoDB
client = MongoClient("mongodb+srv://shrimple:123shrimple@shrimple.ar5le.mongodb.net/?retryWrites=true&w=majority")
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

        # Prepare data for prediction
        features = np.array([[float(data['doc']), float(data['ph']), float(data['salinity']), 
                              float(data['transparency']), float(data['alkalinity'])]])

        # Predict using the trained model
        prediction = model.predict(features)[0]
        prediction_label = "Breedable" if prediction == 1 else "Not Breedable"

        # Calculate feature importance dynamically (using SHAP)
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(features)
        feature_importance = shap_values[0].tolist()  # SHAP values for the input

        # Record user input and prediction result in MongoDB
        prediction_data = {
            'doc': data['doc'],
            'ph': data['ph'],
            'salinity': data['salinity'],
            'transparency': data['transparency'],
            'alkalinity': data['alkalinity'],
            'prediction': prediction_label,
            'location': location,  # Add location to the MongoDB record
            'createdAt': datetime.datetime.now()
        }
        predictions_collection.insert_one(prediction_data)

        # Return the prediction result with feature importance
        return jsonify({
            'prediction': prediction_label,
            'confidence': max(model.predict_proba(features)[0]) * 100,  # Confidence in percentage
            'graph_data': {
                'labels': ['DOC', 'pH', 'Salinity', 'Transparency', 'Alkalinity'],
                'values': feature_importance
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
