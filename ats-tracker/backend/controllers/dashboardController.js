import ResumeAnalysis from '../models/ResumeAnalysis.js';

export const getDashboardHistory = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyToken
    const analyses = await ResumeAnalysis.find({ userId })
      .sort({ uploadDate: -1 })
      .select('fileName uploadDate overallScore'); // Only fetch needed fields for list
      
    res.status(200).json(analyses);
  } catch (error) {
    console.error('Error fetching dashboard history:', error);
    res.status(500).json({ message: 'Error fetching history' });
  }
};
