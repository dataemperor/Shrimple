from flask import Flask, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

# Load your trained model
model = joblib.load('random_forest_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    input_data = [data['doc'], data['ph'], data['salinity'], data['transparency'], data['alkalinity']]
    df = pd.DataFrame([input_data], columns=['Dissolved Oxygen', 'pH', 'Salinity', 'Transparency', 'Alkalinity'])
    prediction = model.predict(df)
    return jsonify({'prediction': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
