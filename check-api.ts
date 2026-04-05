import { GoogleGenAI } from '@google/genai';
async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: "MY_GEMINI_API_KEY" });
    await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: "test"
    });
  } catch (e) {
    console.log("Error with MY_GEMINI_API_KEY:", e.message);
  }
}
test();
