from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/data")
def get_data():
    return jsonify({
        "gainers": [{"symbol": "AVAX", "percent_change": 3.45}],
        "losers": [{"symbol": "LINK", "percent_change": -2.88}],
        "top24h": [{"symbol": "SOL", "percent_change": 4.21}],
        "banner": {"past": "105.3M", "current": "137.9M", "change": 31.0}
    })

if __name__ == "__main__":
    print("Starting Flask backend...")
    app.run(host="0.0.0.0", port=5001)
