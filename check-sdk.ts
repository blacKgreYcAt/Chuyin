import { GoogleGenAI } from '@google/genai';
try {
  const ai = new GoogleGenAI({ apiKey: undefined });
  console.log("Success");
} catch (e) {
  console.log("Error:", e.message);
}
try {
  const ai2 = new GoogleGenAI({ apiKey: "" });
  console.log("Success 2");
} catch (e) {
  console.log("Error 2:", e.message);
}
try {
  const ai3 = new GoogleGenAI({ apiKey: "MY_GEMINI_API_KEY" });
  console.log("Success 3");
} catch (e) {
  console.log("Error 3:", e.message);
}
