import React, { useState } from "react";
import axios from "axios";
import MapView from "./components/MapView";
import VoiceAssistant from "./components/VoiceAssistant";

function App() {
  const [formData, setFormData] = useState({
    distance_km: "",
    avg_speed_kmh: "",
    traffic_level: "",
    elevation_gain_m: "",
    temperature_c: "",
    vehicle_weight_kg: "",
    current_battery_percent: ""
  });

  const [result, setResult] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [chatReply, setChatReply] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setShowMap(false);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData
      );
      setResult(response.data);
    } catch {
      alert("Backend connection failed ❌");
    }
  };

  const speakResponse = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const handleVoiceCommand = async (command) => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", {
        question: command
      });
      setChatReply(res.data.reply);
      speakResponse(res.data.reply);
    } catch {
      alert("Assistant not responding ❌");
    }
  };

  const openGoogleMapsDirections = (station) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-6 text-white">

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl w-full max-w-3xl p-8">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-center">
          EV Smart Energy Optimizer ⚡
        </h1>
        <p className="text-center text-gray-400 mt-1 mb-8">
          AI-Powered Trip Intelligence
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <Input name="distance_km" placeholder="Distance (km)" onChange={handleChange} />
            <Input name="avg_speed_kmh" placeholder="Avg Speed (km/h)" onChange={handleChange} />
          </div>

          <select
            name="traffic_level"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
            required
          >
            <option value="">Traffic Level</option>
            <option value="1">Low Traffic</option>
            <option value="2">Medium Traffic</option>
            <option value="3">High Traffic</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <Input name="elevation_gain_m" placeholder="Elevation Gain (m)" onChange={handleChange} />
            <Input name="temperature_c" placeholder="Temperature °C" onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input name="vehicle_weight_kg" placeholder="Vehicle Weight (kg)" onChange={handleChange} />
            <Input name="current_battery_percent" placeholder="Battery %" onChange={handleChange} />
          </div>

          <button className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 p-3 rounded-xl font-semibold shadow-lg">
            Optimize Trip 🚗⚡
          </button>
        </form>

        {/* RESULT */}
        {result && (
          <div className="mt-10 bg-white/10 rounded-2xl p-6 border border-white/20 animate-fade-in">

            <h2 className="text-lg font-semibold mb-4">
              Trip Energy Summary ⚡
            </h2>

            <BatteryBar value={result.predicted_battery_usage_percent} />

            <div className="mt-4 space-y-2 text-sm">
              <InfoRow icon="🔋" label="Battery Required" value={`${result.predicted_battery_usage_percent}%`} />
              <InfoRow icon="⚡" label="Remaining Battery" value={`${result.remaining_battery_percent}%`} />
            </div>

            <p className="mt-4 font-semibold text-center">
              {result.status}
            </p>

            {result.nearest_charging_station && (
              <div className="mt-5 bg-red-500/10 border border-red-400 rounded-xl p-4">

                <p className="font-semibold text-red-300">
                  ⚡ Nearest Charging Station
                </p>

                <p className="text-sm mt-1">
                  {result.nearest_charging_station.name}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button
                    onClick={() => setShowMap(true)}
                    className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"
                  >
                    Show Map 🗺
                  </button>

                  <button
                    onClick={() =>
                      openGoogleMapsDirections(result.nearest_charging_station)
                    }
                    className="bg-green-500 hover:bg-green-600 p-2 rounded-lg"
                  >
                    View Directions 🚗
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VOICE ASSISTANT */}
        <div className="mt-8">
          <VoiceAssistant onCommand={handleVoiceCommand} />
        </div>

        {chatReply && (
          <div className="mt-3 bg-white/10 rounded-xl p-3 text-sm text-blue-300 animate-fade-in">
            🤖 {chatReply}
          </div>
        )}

        {/* MAP */}
        {showMap && result?.nearest_charging_station && (
          <div className="mt-6 animate-fade-in">
            <MapView chargingStation={result.nearest_charging_station} />
          </div>
        )}
      </div>
    </div>
  );
}

const Input = ({ name, placeholder, onChange }) => (
  <input
    type="number"
    name={name}
    placeholder={placeholder}
    onChange={onChange}
    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-400"
    required
  />
);

const InfoRow = ({ icon, label, value }) => (
  <p>{icon} {label}: <b>{value}</b></p>
);

const BatteryBar = ({ value }) => (
  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
    <div
      className="bg-gradient-to-r from-green-400 to-blue-500 h-3 transition-all duration-700"
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

export default App;