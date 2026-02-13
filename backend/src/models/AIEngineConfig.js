import mongoose from 'mongoose';

const EmotionConfigSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  keywords: {
    en: [{ word: String, weight: { type: Number, default: 1 } }],
    hi: [{ word: String, weight: { type: Number, default: 1 } }]
  },
  templates: {
    validation: [String],
    reflection: [String],
    insight: [String],
    action: [String],
    followUp: [String]
  },
  groundingExercises: [String],
  breathingTechniques: [String],
  reframingScripts: [String],
  microChallenges: [String]
}, { _id: false });

const AIEngineConfigSchema = new mongoose.Schema({
  emotions: [EmotionConfigSchema],
  crisisKeywords: {
    en: [String],
    hi: [String]
  },
  globalTemplates: {
    welcome: [String],
    unknown: [String],
    emergency: [String]
  }
}, { timestamps: true });

export default mongoose.model('AIEngineConfig', AIEngineConfigSchema);
