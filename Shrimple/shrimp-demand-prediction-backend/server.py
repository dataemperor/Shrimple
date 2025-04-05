from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the model
model = joblib.load("model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        Q1 = float(data["Q1"])
        Q2 = float(data["Q2"])
        Q3 = float(data["Q3"])

        # Convert input to numpy array and predict
        input_data = np.array([[Q1, Q2, Q3]])
        prediction = model.predict(input_data)[0]

        return jsonify({"prediction": prediction})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
