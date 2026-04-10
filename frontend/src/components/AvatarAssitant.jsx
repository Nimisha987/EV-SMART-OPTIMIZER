function AvatarAssistant({ isSpeaking }) {
  return (
    <div className="flex flex-col items-center mt-6">
      <div
        className={`relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl transition-all duration-300 ${
          isSpeaking ? "animate-pulse ring-4 ring-blue-400" : ""
        }`}
      >
        <div className="text-3xl"></div>
        {isSpeaking && (
          <span className="absolute inset-0 rounded-full animate-glow"></span>
        )}
      </div>
      <p className="text-sm text-gray-300 mt-2">
        EV Assistant

      </p>
    </div>
  );
}
export default AvatarAssistant;