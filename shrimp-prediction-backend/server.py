import joblib
import flask
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from pymongo import MongoClient
import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Shrimp Prediction API!"})

# Load the trained model
model = joblib.load('random_forest_model.pkl')  # Adjust with your actual path

# Connect to MongoDB
client = MongoClient("mongodb+srv://shrimple:123shrimple@shrimple.ar5le.mongodb.net/?retryWrites=true&w=majority")
db = client.shrimple  # Name of your MongoDB database
predictions_collection = db.predictions  # Collection where predictions will be stored

# Route to handle prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from the frontend request
        data = request.get_json()

        # Validate input data
        if not all(k in data for k in ('doc', 'ph', 'salinity', 'transparency', 'alkalinity')):
            return jsonify({'error': 'Missing required fields'}), 400

        # Prepare data for prediction (assuming model takes these features)
        features = [[float(data['doc']), float(data['ph']), float(data['salinity']), float(data['transparency']), float(data['alkalinity'])]]

        # Predict using the trained model
        prediction = model.predict(features)[0]

        # Convert numeric prediction to label
        prediction_label = "Breedable" if prediction == 1 else "Not Breedable"

        # Record user input and prediction result in MongoDB
        prediction_data = {
            'doc': data['doc'],
            'ph': data['ph'],
            'salinity': data['salinity'],
            'transparency': data['transparency'],
            'alkalinity': data['alkalinity'],
            'prediction': prediction_label,  # Store as a word instead of number
            'createdAt': datetime.datetime.now()
        }
        predictions_collection.insert_one(prediction_data)

        # Return the prediction result
        return jsonify({'prediction': prediction_label}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
