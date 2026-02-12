import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Hash password before saving to database
 */
export const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

/**
 * Compare password with hashed password
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};

/**
 * Generate JWT token
 */
export const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Decode JWT token without verification
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Mock AI sentiment analysis
 * In production, use real AI APIs like Google NLP, Azure Text Analytics, etc
 */
export const analyzeSentiment = (text) => {
  const positive = ['happy', 'great', 'excellent', 'wonderful', 'amazing', 'love', 'good', 'fantastic', 'blessed', 'grateful'];
  const negative = ['sad', 'angry', 'frustrated', 'stressed', 'anxious', 'depressed', 'hate', 'terrible', 'awful', 'hopeless'];
  const neutral = ['okay', 'fine', 'normal', 'regular', 'neutral', 'so-so', 'alright'];

  const lowerText = text.toLowerCase();
  let sentiment = 'neutral';
  let confidence = 0.5;

  // Count occurrences
  const positiveCount = positive.filter(word => lowerText.includes(word)).length;
  const negativeCount = negative.filter(word => lowerText.includes(word)).length;

  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    confidence = Math.min(0.95, 0.5 + (positiveCount * 0.15));
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    confidence = Math.min(0.95, 0.5 + (negativeCount * 0.15));
  }

  return { sentiment, confidence };
};

/**
 * Map emotion text to mood enum
 */
export const mapEmotionToMood = (emotionalDescription) => {
  const moodMap = {
    'very_happy': ['amazing', 'excellent', 'fantastic', 'wonderful', 'blessed'],
    'happy': ['good', 'happy', 'content', 'satisfied', 'pleased'],
    'neutral': ['okay', 'fine', 'normal', 'alright', 'so-so'],
    'sad': ['sad', 'unhappy', 'down', 'low', 'blue'],
    'very_sad': ['depressed', 'miserable', 'terrible', 'awful', 'devastated']
  };

  const lowerText = emotionalDescription.toLowerCase();
  
  for (const [mood, keywords] of Object.entries(moodMap)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return mood;
    }
  }
  
  return 'neutral';
};

/**
 * Get time-based suggestion context
 */
export const getTimeContext = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return {
      timeOfDay: 'morning',
      suggestionType: 'energizing',
      message: 'Good morning! Start your day with positivity.'
    };
  } else if (hour < 17) {
    return {
      timeOfDay: 'afternoon',
      suggestionType: 'balanced',
      message: 'Hope your day is going well!'
    };
  } else if (hour < 21) {
    return {
      timeOfDay: 'evening',
      suggestionType: 'calming',
      message: 'Time to wind down and reflect.'
    };
  } else {
    return {
      timeOfDay: 'night',
      suggestionType: 'relaxing',
      message: 'Sleep well and take care of yourself.'
    };
  }
};
