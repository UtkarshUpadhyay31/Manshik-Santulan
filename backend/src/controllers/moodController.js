import MoodEntry from '../models/MoodEntry.js';
import AISuggestion from '../models/AISuggestion.js';
import { mapEmotionToMood, analyzeSentiment, getTimeContext } from '../utils/authUtils.js';

/**
 * Create Mood Entry - User submits daily mood check-in
 */
export const createMoodEntry = async (req, res) => {
  try {
    const { mood, emotion, stressLevel, description, triggers, activities } = req.body;

    // Validation
    if (!mood || !emotion || !stressLevel) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mood, emotion, and stress level are required' 
      });
    }

    const moodEntry = new MoodEntry({
      userId: req.user.userId,
      mood,
      emotion,
      stressLevel,
      description,
      triggers: triggers || [],
      activities: activities || []
    });

    await moodEntry.save();

    // Generate AI suggestions based on mood
    await generateAISuggestions(req.user.userId, mood, stressLevel);

    res.status(201).json({
      success: true,
      message: 'Mood entry created successfully',
      moodEntry
    });
  } catch (error) {
    console.error('Create mood entry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating mood entry' 
    });
  }
};

/**
 * Analyze Text for Emotion Detection
 */
export const analyzeEmotion = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Text is required for emotion analysis' 
      });
    }

    const sentiment = analyzeSentiment(text);
    const detectedMood = mapEmotionToMood(text);

    res.status(200).json({
      success: true,
      sentiment,
      detectedMood
    });
  } catch (error) {
    console.error('Analyze emotion error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error analyzing emotion' 
    });
  }
};

/**
 * Get Mood History - Last 30 days
 */
export const getMoodHistory = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moodHistory = await MoodEntry.find({
      userId: req.user.userId,
      timestamp: { $gte: thirtyDaysAgo }
    }).sort({ timestamp: -1 });

    // Calculate mood statistics
    const stats = calculateMoodStats(moodHistory);

    res.status(200).json({
      success: true,
      moodHistory,
      stats
    });
  } catch (error) {
    console.error('Get mood history error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching mood history' 
    });
  }
};

/**
 * Get Today's Mood Entry
 */
export const getTodayMood = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayMood = await MoodEntry.findOne({
      userId: req.user.userId,
      timestamp: { $gte: today, $lt: tomorrow }
    });

    res.status(200).json({
      success: true,
      moodEntry: todayMood || null,
      hasEnteredToday: !!todayMood
    });
  } catch (error) {
    console.error('Get today mood error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching today mood' 
    });
  }
};

/**
 * Generate AI Suggestions
 */
export const generateAISuggestions = async (userId, mood, stressLevel) => {
  try {
    const timeContext = getTimeContext();
    
    // Create suggestions based on mood and stress level
    const suggestions = [];

    // Breathing exercise for high stress
    if (stressLevel >= 7) {
      suggestions.push({
        userId,
        category: 'breathing',
        title: 'Guided Breathing Exercise',
        description: 'Take a moment to breathe deeply and calm your mind',
        duration: 5,
        difficulty: 'easy',
        content: '4-7-8 Breathing: Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.'
      });
    }

    // Meditation suggestion
    suggestions.push({
      userId,
      category: 'meditation',
      title: 'Mindfulness Meditation',
      description: 'A short guided meditation to center yourself',
      duration: 10,
      difficulty: 'medium',
      content: 'Focus on your breath and present moment...'
    });

    // Activity suggestion based on mood
    if (mood === 'sad' || mood === 'very_sad') {
      suggestions.push({
        userId,
        category: 'activity',
        title: 'Lift Your Mood Activity',
        description: 'Try activities that bring joy and engagement',
        duration: 30,
        difficulty: 'easy',
        content: 'Consider: going for a walk, calling a friend, or doing a hobby you enjoy'
      });
    }

    // Affirmation
    suggestions.push({
      userId,
      category: 'affirmation',
      title: 'Daily Affirmation',
      description: 'Positive affirmation for the day',
      content: 'You are capable, resilient, and worthy of happiness.'
    });

    // Save all suggestions
    await AISuggestion.insertMany(suggestions);
  } catch (error) {
    console.error('Generate AI suggestions error:', error);
  }
};

/**
 * Get AI Suggestions
 */
export const getAISuggestions = async (req, res) => {
  try {
    const suggestions = await AISuggestion.find({
      userId: req.user.userId,
      isCompleted: false
    }).sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Get AI suggestions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching suggestions' 
    });
  }
};

/**
 * Mark Suggestion as Completed
 */
export const completeSuggestion = async (req, res) => {
  try {
    const { suggestionId } = req.params;
    const { feedback } = req.body;

    const suggestion = await AISuggestion.findByIdAndUpdate(
      suggestionId,
      {
        isCompleted: true,
        completedAt: new Date(),
        feedback: feedback || null
      },
      { new: true }
    );

    if (!suggestion) {
      return res.status(404).json({ 
        success: false, 
        message: 'Suggestion not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Suggestion marked as completed',
      suggestion
    });
  } catch (error) {
    console.error('Complete suggestion error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating suggestion' 
    });
  }
};

/**
 * Calculate Mood Statistics
 */
const calculateMoodStats = (moodHistory) => {
  if (moodHistory.length === 0) {
    return {
      totalEntries: 0,
      averageStress: 0,
      dominantMood: null,
      dominantEmotion: null
    };
  }

  const totalEntries = moodHistory.length;
  const averageStress = Math.round(
    moodHistory.reduce((sum, entry) => sum + entry.stressLevel, 0) / totalEntries
  );

  // Find most common mood and emotion
  const moodCount = {};
  const emotionCount = {};

  moodHistory.forEach(entry => {
    moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
    emotionCount[entry.emotion] = (emotionCount[entry.emotion] || 0) + 1;
  });

  const dominantMood = Object.keys(moodCount).reduce((a, b) =>
    moodCount[a] > moodCount[b] ? a : b
  );

  const dominantEmotion = Object.keys(emotionCount).reduce((a, b) =>
    emotionCount[a] > emotionCount[b] ? a : b
  );

  return {
    totalEntries,
    averageStress,
    dominantMood,
    dominantEmotion
  };
};
