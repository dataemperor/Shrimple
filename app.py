from flask import Flask, render_template, request, jsonify
import numpy as np
import pickle

# Load the trained RandomForestRegressor model
with open('model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Load the scaler used in training
with open('scaler.pkl', 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('ShrimpDemand.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    lag_1 = data['lag_1']
    lag_2 = data['lag_2']
    rolling_mean = data['rolling_mean']

    # Prepare input data for the model
    input_data = np.array([[lag_1, lag_2, rolling_mean]])
    input_data_scaled = scaler.transform(input_data)  # Scale input data

    # Make prediction
    forecast = model.predict(input_data_scaled)[0]

    return jsonify({'forecast': round(forecast, 2)})

if __name__ == '__main__':
    app.run(debug=True)
