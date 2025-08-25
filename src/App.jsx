import React, { useState } from "react";

const App = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "ta-IN"; // Tamil recognition
    recognition.start();
    console.log("🎤 Listening...");

    recognition.onresult = (event) => {
      let voiceText = event.results[0][0].transcript.toLowerCase();
      console.log("🎤 Voice Input:", voiceText);

      // 🔹 Remove filler words (Tamil + English)
      voiceText = voiceText
        .replace(/அப்புறம்|பிறகு|என்று|சொன்னேன்|விடை|answer|then|after/gi, "")
        .trim();

      // 🔹 Replace words with math symbols
      let exp = voiceText
        // English
        .replace(/plus|add|addition/gi, "+")
        .replace(/minus|subtract|subtraction|less/gi, "-")
        .replace(/times|into|multiply|multiplication|product/gi, "*")
        .replace(/divide|by|division|over/gi, "/")

        // Tamil
        .replace(/கூட்டு|கூட்டல்|சேர்த்து|பிளஸ்|ஆட்|சம்மேச்சு/gi, "+")
        .replace(/கழி|கழித்தல்|மைனஸ்|குறைத்தல்|கம்மி|கழிச்சு/gi, "-")
        .replace(/பெருக்கு|மடக்கு|இன்டு|மடங்காக|ப்ராடக்ட்|பெருக்கல்/gi, "*")
        .replace(/வகுத்து|வகுத்தல்|வகுக்க|டிவைடட்|பங்கிட்டு|பகுத்தல்/gi, "/");
      setExpression(exp);

      try {
        // Allow ONLY numbers, operators, spaces, brackets
        const validPattern = /^[0-9+\-*/().\s]+$/;

        if (validPattern.test(exp)) {
          const ans = eval(exp);
          setResult(ans);

          // Speak out result
          const synth = window.speechSynthesis;
          const utter = new SpeechSynthesisUtterance(`The answer is ${ans}`);
          utter.lang = "ta-IN";
          synth.speak(utter);
        } else {
          console.warn("❌ Invalid string detected, skipping...");
          setResult("");
        }
      } catch (error) {
        console.error("⚠️ Error evaluating:", error);
        setResult(""); // error skip
      }
    };
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Couples Calculator</h1>

      <button
        onClick={startListening}
        className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-3 rounded-2xl 
        hover:scale-110 transition transform duration-300 ease-in-out shadow-lg 
        hover:shadow-pink-500/50 animate-bounce"
      >
        Start Calculator
      </button>

      {/* Expression display */}
      {expression && (
        <p className="mt-4 text-lg animate-fadeIn">Expression: {expression}</p>
      )}

      {/* Result display only if available */}
      {result && (
        <p className="mt-4 text-3xl font-extrabold drop-shadow-lg animate-pulse">
          Result {result}
        </p>
      )}
    </div>
  );
};

export default App;
