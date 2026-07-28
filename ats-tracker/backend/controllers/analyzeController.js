import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { parseResume } from '../services/parser.js';
import { analyzeWithGemini } from '../services/geminiAnalyzer.js';

export const analyzeResume = async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;
    const userId = req.user.id;

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // 1. Extract Text
    const text = await parseResume(file);

    // 2. Perform Gemini AI Analysis directly (no fallback)
    const geminiResult = await analyzeWithGemini(text, jobDescription);

    // 3. Save to DB on clean success
    const newAnalysis = new ResumeAnalysis({
      userId,
      fileName: file.originalname,
      analysisSource: 'ai',
      aiModel: geminiResult.aiModel,
      analysisVersion: geminiResult.analysisVersion,
      ...geminiResult
    });

    await newAnalysis.save();

    // 4. Return result
    return res.status(200).json({
      success: true,
      _id: newAnalysis._id,
      analysisSource: 'ai',
      ...geminiResult
    });
  } catch (error) {
    console.error('[AI Analysis Failure]', error);
    return res.status(500).json({
      success: false,
      error: 'AI analysis failed. Please try again.'
    });
  }
};

export const getAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Ensure the analysis belongs to the user requesting it
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this analysis' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ message: 'Error fetching analysis' });
  }
};
