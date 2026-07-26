import User from '../models/User.js';

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    // Check if mandatory fields are present
    const mandatoryFields = ['name', 'collegeName', 'currentStatus', 'currentRole', 'graduationYear', 'location'];
    let isComplete = true;
    
    for (const field of mandatoryFields) {
      if (!updateData[field] || updateData[field].trim() === '') {
        isComplete = false;
        break;
      }
    }
    
    updateData.profileCompleted = isComplete;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
