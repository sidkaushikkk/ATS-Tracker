import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

async function testModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const modelsToTest = [
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-2.0-flash-lite',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite'
  ];

  console.log("Testing models for non-zero quota...");

  for (const model of modelsToTest) {
    try {
      console.log(`\nTesting ${model}...`);
      const response = await ai.models.generateContent({
        model: model,
        contents: "Hello, just testing if you work.",
      });
      console.log(`✅ SUCCESS with ${model}! Response:`, response.text);
      // If we find one that works, we can stop testing
      break;
    } catch (err) {
      console.log(`❌ FAILED with ${model}. Error:`, err.message || err.statusText || err);
    }
  }
}

testModels();
