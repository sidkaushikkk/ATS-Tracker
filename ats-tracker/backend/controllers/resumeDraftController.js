import ResumeDraft from '../models/ResumeDraft.js';

// Get all drafts for user
export const getDrafts = async (req, res) => {
  try {
    const drafts = await ResumeDraft.find({ userId: req.user.id })
      .sort({ updatedAt: -1 });
    res.status(200).json(drafts);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({ message: 'Error fetching drafts' });
  }
};

// Get specific draft
export const getDraft = async (req, res) => {
  try {
    const draft = await ResumeDraft.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    res.status(200).json(draft);
  } catch (error) {
    console.error('Error fetching draft:', error);
    res.status(500).json({ message: 'Error fetching draft' });
  }
};

// Create new draft
export const createDraft = async (req, res) => {
  try {
    const { title, resumeData, isDefault } = req.body;
    
    // If setting as default, unset others
    if (isDefault) {
      await ResumeDraft.updateMany({ userId: req.user.id }, { isDefault: false });
    }

    const draft = new ResumeDraft({
      userId: req.user.id,
      title: title || 'Untitled Draft',
      resumeData,
      isDefault: isDefault || false
    });

    await draft.save();
    res.status(201).json(draft);
  } catch (error) {
    console.error('Error creating draft:', error);
    res.status(500).json({ message: 'Error creating draft' });
  }
};

// Update draft
export const updateDraft = async (req, res) => {
  try {
    const { title, resumeData, isDefault } = req.body;
    
    const draft = await ResumeDraft.findOne({ _id: req.params.id, userId: req.user.id });
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }

    // If setting as default, unset others
    if (isDefault && !draft.isDefault) {
      await ResumeDraft.updateMany({ userId: req.user.id }, { isDefault: false });
    }

    if (title) draft.title = title;
    if (resumeData) draft.resumeData = resumeData;
    if (isDefault !== undefined) draft.isDefault = isDefault;

    await draft.save();
    res.status(200).json(draft);
  } catch (error) {
    console.error('Error updating draft:', error);
    res.status(500).json({ message: 'Error updating draft' });
  }
};

// Delete draft
export const deleteDraft = async (req, res) => {
  try {
    const draft = await ResumeDraft.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    res.status(200).json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Error deleting draft:', error);
    res.status(500).json({ message: 'Error deleting draft' });
  }
};
