from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.json_util import dumps

app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests

# MongoDB connection
client = MongoClient("mongodb://127.0.0.1:27017/")  # Ensure you're connecting to MongoDB on port 27017
db = client["retailstoremanagementsystem"]

from flask import render_template

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/data/<entity>', methods=['GET'])
def get_entity_data(entity):
    try:
        # Fetch data from the specified collection
        collection = db[entity]
        data = list(collection.find({}))  # Convert to list to serialize
        return dumps(data), 200  # Return serialized JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/query', methods=['POST'])
def execute_query():
    try:
        data = request.get_json()
        query = data.get("query")  # Assume query is a dictionary
        collection_name = query.get("collection")
        filter_query = query.get("filter", {})
        projection = query.get("projection", {})
        collection = db[collection_name]

        # Perform the query on the MongoDB collection
        results = list(collection.find(filter_query, projection))
        return dumps(results), 200  # Return serialized JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)  # Flask app runs on port 5001