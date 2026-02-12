import mongoose from 'mongoose';

/**
 * AI Suggestion Schema - Stores AI-generated recommendations for users
 */
const AISuggestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['breathing', 'meditation', 'activity', 'affirmation', 'journal'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  duration: {
    type: Number, // in minutes
    min: 1,
    max: 120
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  content: {
    type: String, // Detailed guidance for breathing, meditation, etc
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  feedback: {
    type: String,
    enum: ['helpful', 'not_helpful', 'neutral'],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

// Index for faster queries
AISuggestionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('AISuggestion', AISuggestionSchema);
