import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { parseResume } from '../services/parser.js';
import { analyzeWithGemini } from '../services/geminiAnalyzer.js';

export const analyzeResume = async (req, res) => {
  console.log("\n========== NEW ANALYSIS ==========");
  console.time("Total Analysis");

  try {
    console.log("[1] Analysis request received");

    const file = req.file;
    const { jobDescription } = req.body;
    const userId = req.user.id;

    if (!file) {
      console.log("[X] No file uploaded");
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    console.log("[2] Resume:", file.originalname);

    // 1. Extract Text
    console.time("Resume Parsing");
    const text = await parseResume(file);
    console.timeEnd("Resume Parsing");
    console.log("[3] Resume parsed successfully");

    // 2. Gemini
    console.log("[4] Sending request to Gemini...");
    console.time("Gemini Analysis");

    const geminiResult = await analyzeWithGemini(text, jobDescription);

    console.timeEnd("Gemini Analysis");
    console.log("[5] Gemini analysis successful");

    // 3. Save to DB
    console.log("[6] Saving analysis to MongoDB...");
    await new ResumeAnalysis({
      userId,
      fileName: file.originalname,
      analysisSource: 'ai',
      aiModel: geminiResult.aiModel,
      analysisVersion: geminiResult.analysisVersion,
      ...geminiResult
    }).save();

    console.log("[7] Saved successfully");

    console.timeEnd("Total Analysis");
    console.log("[8] Response sent to frontend");

    return res.status(200).json({
      success: true,
      analysisSource: 'ai',
      ...geminiResult
    });

  } catch (error) {
    console.timeEnd("Total Analysis");

    console.error("[X] Analysis failed");
    console.error(error);

    return res.status(500).json({
      success: false,
      error: 'AI analysis failed. Please try again.'
    });
  }
};