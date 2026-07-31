import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { parseResume } from '../services/parser.js';
import { analyzeWithGemini } from '../services/geminiAnalyzer.js';

export const analyzeResume = async (req, res) => {
  console.log('\n========== NEW ANALYSIS ==========');
  console.time('Total Analysis');

  try {
    console.log('[1] Analysis request received');

    const file = req.file;
    const { jobDescription } = req.body;
    const userId = req.user.id;

    if (!file) {
      console.log('[X] No file uploaded');
      console.timeEnd('Total Analysis');

      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    console.log(`[2] File received: ${file.originalname}`);

    // 1. Extract text from resume
    console.log('[3] Parsing resume...');
    console.time('Resume Parsing');

    const text = await parseResume(file);

    console.timeEnd('Resume Parsing');
    console.log(`[4] Resume parsed successfully (${text.length} characters)`);

    // 2. Gemini Analysis
    console.log('[5] Sending request to Gemini...');
    console.time('Gemini Analysis');

    const geminiResult = await analyzeWithGemini(text, jobDescription);

    console.timeEnd('Gemini Analysis');
    console.log('[6] Gemini analysis completed successfully');

    // 3. Save to MongoDB
    console.log('[7] Saving analysis to MongoDB...');

    const newAnalysis = new ResumeAnalysis({
      userId,
      fileName: file.originalname,
      analysisSource: 'ai',
      aiModel: geminiResult.aiModel,
      analysisVersion: geminiResult.analysisVersion,
      ...geminiResult
    });

    await newAnalysis.save();

    console.log('[8] Analysis saved successfully');

    console.timeEnd('Total Analysis');
    console.log('[9] Response sent to frontend');

    return res.status(200).json({
      success: true,
      _id: newAnalysis._id,
      analysisSource: 'ai',
      ...geminiResult
    });

  } catch (error) {
    console.timeEnd('Total Analysis');

    console.error('\n[X] AI ANALYSIS FAILED');
    console.error(error);

    return res.status(500).json({
      success: false,
      error: 'AI analysis failed. Please try again.'
    });
  }
};

export const getAnalysis = async (req, res) => {
  try {
    console.log(`[GET] Fetching analysis: ${req.params.id}`);

    const analysis = await ResumeAnalysis.findById(req.params.id);

    if (!analysis) {
      console.log('[GET] Analysis not found');

      return res.status(404).json({
        message: 'Analysis not found'
      });
    }

    if (analysis.userId.toString() !== req.user.id) {
      console.log('[GET] Unauthorized access attempt');

      return res.status(403).json({
        message: 'Not authorized to view this analysis'
      });
    }

    console.log('[GET] Analysis returned successfully');

    return res.status(200).json(analysis);

  } catch (error) {
    console.error('[GET] Error fetching analysis:', error);

    return res.status(500).json({
      message: 'Error fetching analysis'
    });
  }
};