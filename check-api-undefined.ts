import { GoogleGenAI } from '@google/genai';
async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: undefined });
    await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: "test"
    });
  } catch (e) {
    console.log("Error with undefined:", e.message);
  }
}
test();
