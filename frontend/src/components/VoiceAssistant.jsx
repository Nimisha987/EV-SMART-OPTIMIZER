import { useState, useRef, useEffect } from "react";

function VoiceAssistant({ onCommand }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("User said:", transcript);
      onCommand(transcript);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, [onCommand]);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition not supported ❌");
      return;
    }

    recognitionRef.current.start();
  };

  return (
    <div className="bg-white/10 rounded-xl p-4 text-center mt-4">

      <p className="font-semibold mb-3">
        🎙️ Voice Assistant
      </p>

      <button
        onClick={startListening}
        className={`px-6 py-2 rounded-full font-semibold transition-all ${
          listening
            ? "bg-red-500 animate-pulse"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {listening ? "Listening..." : "🎤 Speak"}
      </button>

    </div>
  );
}

export default VoiceAssistant;