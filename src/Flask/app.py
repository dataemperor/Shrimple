from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB connection string (same as in MongoDB Compass)
mongo_uri = "mongodb://localhost:27017"

# Connect to MongoDB
client = MongoClient(mongo_uri)  # Updated line


# Access the database and collection
db = client["your_database_name"]
collection = db["your_collection_name"]

@app.route('/')
def test_connection():
    # Insert a test document into the collection
    collection.insert_one({"test": "Hello from Flask and MongoDB!"})
    return jsonify({"message": "Document inserted successfully!"})

if __name__ == "__main__":
    app.run(debug=True)
