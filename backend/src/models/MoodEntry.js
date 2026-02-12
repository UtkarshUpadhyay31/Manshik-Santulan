import mongoose from 'mongoose';

/**
 * Mood Entry Schema - Stores user mood check-ins and emotional data
 */
const MoodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    enum: ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'],
    required: [true, 'Mood is required']
  },
  emotion: {
    type: String,
    enum: ['stressed', 'anxious', 'calm', 'content', 'excited', 'confused', 'angry', 'tired'],
    required: [true, 'Emotion is required']
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Stress level is required']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  triggers: [{
    type: String,
    maxlength: [100, 'Trigger cannot exceed 100 characters']
  }],
  activities: [{
    type: String,
    maxlength: [100, 'Activity cannot exceed 100 characters']
  }],
  timestamp: {
    type: Date,
    default: Date.now
  },
  timeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night'],
    default: function() {
      const hour = new Date().getHours();
      if (hour < 12) return 'morning';
      if (hour < 17) return 'afternoon';
      if (hour < 21) return 'evening';
      return 'night';
    }
  }
});

// Index for faster queries
MoodEntrySchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('MoodEntry', MoodEntrySchema);
