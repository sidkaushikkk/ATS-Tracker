import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { parseResume } from '../services/parser.js';
import { analyzeResumeContent } from '../services/analyzer.js';
import { analyzeWithGemini } from '../services/geminiAnalyzer.js';

export const analyzeResume = async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;
    const userId = req.user.id;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // 1. Extract Text
    const text = await parseResume(file);

    let finalAnalysis = {};
    let analysisSource = 'fallback';
    let aiModel = null;
    let analysisVersion = null;

    // 2. Try AI Analysis if Enabled
    const isAiEnabled = process.env.AI_ANALYSIS_ENABLED === 'true';
    if (isAiEnabled) {
      try {
        const geminiResult = await analyzeWithGemini(text, jobDescription);
        finalAnalysis = geminiResult;
        analysisSource = 'ai';
        aiModel = geminiResult.aiModel;
        analysisVersion = geminiResult.analysisVersion;
      } catch (aiError) {
        console.error('[AI Analysis Failed] Falling back to rule-based analyzer.', aiError.message);
        analysisSource = 'failed';
      }
    }

    // 3. Fallback to rule-based analyzer
    if (analysisSource === 'fallback' || analysisSource === 'failed') {
      const fallbackResult = analyzeResumeContent(text);
      finalAnalysis = {
        analysisType: 'fallback',
        overallScore: fallbackResult.overallScore,
        matchedKeywords: fallbackResult.matchedKeywords.map(k => ({ name: k.name, evidence: 'Rule-based match' })),
        recommendedRoles: fallbackResult.recommendedRoles.map(r => ({ role: r.role, match: r.match, reason: r.level })),
        problems: fallbackResult.problems.map(p => ({ title: 'Observation', severity: 'medium', evidence: p, recommendation: p })),
        suggestions: fallbackResult.suggestions,
        keyObservations: fallbackResult.keyObservations
      };
    }

    // 4. Save to DB
    const newAnalysis = new ResumeAnalysis({
      userId,
      fileName: file.originalname,
      analysisSource,
      aiModel,
      analysisVersion,
      ...finalAnalysis
    });

    await newAnalysis.save();

    // 5. Return result
    res.status(200).json({
      _id: newAnalysis._id,
      analysisSource,
      ...finalAnalysis
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
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this analysis' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ message: 'Error fetching analysis' });
  }
};
