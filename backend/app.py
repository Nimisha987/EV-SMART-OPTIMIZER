from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

from utils.charging_data import charging_stations
from utils.distance_helper import calculate_distance
# from utils.cost_calculator import estimate_cost

app = Flask(__name__)
CORS(app)

model = joblib.load("ev_battery_model.pkl")


@app.route("/")
def home():
    return "EV Backend Running 🚀"


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        distance_km = data["distance_km"]
        avg_speed_kmh = data["avg_speed_kmh"]
        traffic_level = data["traffic_level"]
        elevation_gain_m = data["elevation_gain_m"]
        temperature_c = data["temperature_c"]
        vehicle_weight_kg = data["vehicle_weight_kg"]
        current_battery_percent = data["current_battery_percent"]

        user_lat = data.get("user_lat", 28.6139)
        user_lng = data.get("user_lng", 77.2090)

        features = np.array([[
            distance_km,
            avg_speed_kmh,
            traffic_level,
            elevation_gain_m,
            temperature_c,
            vehicle_weight_kg
        ]])

        predicted_usage = round(float(model.predict(features)[0]), 2)
        remaining_battery = round(current_battery_percent - predicted_usage, 2)
        # estimated_cost = estimate_cost(predicted_usage)

        nearest_station = None

        if predicted_usage > current_battery_percent:
            status = "⚠ Charging Required"

            nearest_station = min(
                charging_stations,
                key=lambda station: calculate_distance(
                    user_lat, user_lng,
                    station["lat"], station["lng"]
                )
            )
        else:
            status = "✅ No Charging Needed"

        return jsonify({
            "predicted_battery_usage_percent": predicted_usage,
            "remaining_battery_percent": remaining_battery,
            # "estimated_trip_cost": estimated_cost,
            "status": status,
            "nearest_charging_station": nearest_station
        })

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/chat",methods=["POST"])
def chat():
    try:
        question = request.json.get("question","").lower()

        if "battery" in question:
            reply = "Your battery usage depends on trip distance, speed, and conditions."
        elif "charging" in question or "charge" in question:
            reply = "I can suggest the nearest charging station if needed."
        elif "hello" in question or "hi" in question:
            reply= "Hello I am your EV smart assistant."
        else:
            reply = "I can help with EV battery, charging, and trip planning."
        return jsonify({"reply":reply})
    
    except Exception as e:
        return jsonify({"error":str(e)})
    
    
if __name__ == "__main__":
    app.run(debug=True)