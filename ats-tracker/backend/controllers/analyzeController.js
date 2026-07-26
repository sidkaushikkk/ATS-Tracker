import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { parseResume } from '../services/parser.js';
import { analyzeResumeContent } from '../services/analyzer.js';

export const analyzeResume = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user.id; // from verifyToken middleware

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // 1. Extract Text
    const text = await parseResume(file);

    // 2. Analyze Text
    const analysisResult = analyzeResumeContent(text);

    // 3. Save to DB
    const newAnalysis = new ResumeAnalysis({
      userId,
      fileName: file.originalname,
      overallScore: analysisResult.overallScore,
      matchedKeywords: analysisResult.matchedKeywords,
      recommendedRoles: analysisResult.recommendedRoles,
      problems: analysisResult.problems,
      suggestions: analysisResult.suggestions,
      keyObservations: analysisResult.keyObservations
    });

    await newAnalysis.save();

    // 4. Return result
    res.status(200).json({
      _id: newAnalysis._id,
      ...analysisResult
    });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ message: 'Error analyzing resume', error: error.message });
  }
};

export const getAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Ensure the analysis belongs to the user requesting it
    if (analysis.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this analysis' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ message: 'Error fetching analysis' });
  }
};
