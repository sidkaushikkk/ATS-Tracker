import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

async function listModels() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // According to SDK docs, we can list models using ai.models.list()
    // However, some versions use ai.models.listModels()
    // We will fetch and just log them
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    console.log("AVAILABLE MODELS:");
    data.models.forEach(m => {
      if (m.name.includes("gemini") && m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`- ${m.name}`);
      }
    });
  } catch (err) {
    console.error("Error fetching models:", err);
  }
}

listModels();
