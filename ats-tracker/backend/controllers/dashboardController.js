import ResumeAnalysis from '../models/ResumeAnalysis.js';

import User from '../models/User.js';

export const getDashboardHistory = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyToken
    
    // 1. Fetch user profile
    const userProfile = await User.findById(userId).select('-__v');
    
    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Fetch history
    const analyses = await ResumeAnalysis.find({ userId })
      .sort({ uploadDate: -1 })
      .select('fileName uploadDate overallScore'); // Only fetch needed fields for list
      
    // 3. Calculate metrics
    const resumesAnalyzed = analyses.length;
    let latestScore = 0;
    let averageScore = 0;
    let bestScore = 0;

    if (resumesAnalyzed > 0) {
      latestScore = analyses[0].overallScore;
      
      const totalScore = analyses.reduce((sum, item) => sum + item.overallScore, 0);
      averageScore = Math.round(totalScore / resumesAnalyzed);
      
      bestScore = Math.max(...analyses.map(item => item.overallScore));
    }

    // 4. Return combined response
    res.status(200).json({
      profile: userProfile,
      metrics: {
        latestScore,
        averageScore,
        bestScore
      },
      history: analyses
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};
