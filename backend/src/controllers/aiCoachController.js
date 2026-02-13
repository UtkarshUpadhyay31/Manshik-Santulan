import { EmotionEngine } from '../ai-engine/EmotionEngine.js';
import { ResponseGenerator } from '../ai-engine/ResponseGenerator.js';
import { CrisisLayer } from '../ai-engine/CrisisLayer.js';
import AIUserContext from '../models/AIUserContext.js';
import AIEngineConfig from '../models/AIEngineConfig.js';

const emotionEngine = new EmotionEngine();
const responseGenerator = new ResponseGenerator();
const crisisLayer = new CrisisLayer();

/**
 * Handle AI Coach Chat
 */
export const handleAIChat = async (req, res) => {
    try {
        const { message, userId, userName } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        // 1. Crisis Detection
        const crisis = crisisLayer.detect(message);
        if (crisis.isCrisis) {
            return res.json({
                success: true,
                type: 'emergency',
                message: crisis.message,
                isCrisis: true
            });
        }

        // 2. Emotion Analysis
        const analysis = emotionEngine.analyze(message);

        // 3. Get/Update User Context
        let context = await AIUserContext.findOne({ userId });
        if (!context) {
            context = new AIUserContext({ userId, userName });
        }

        // Update dominant emotion and trigger topics
        if (analysis.dominantEmotion) {
            context.dominantEmotion = analysis.dominantEmotion.name;
            // Add keywords as trigger topics if not present
            analysis.dominantEmotion.keywords.forEach(k => {
                if (!context.triggerTopics.includes(k)) {
                    context.triggerTopics.push(k);
                }
            });

            // Auto switch mode based on emotion
            context.currentMode = analysis.dominantEmotion.mode || 'Calm';
        }

        // 4. Generate Response (Now Async)
        const aiResponse = await responseGenerator.generate(analysis, { firstName: userName }, context.past5Conversations);

        // 5. Store Conversation (keep last 5)
        context.past5Conversations.unshift({
            userMessage: message,
            aiResponse: aiResponse,
            detectedEmotion: analysis.dominantEmotion ? analysis.dominantEmotion.name : 'Unknown'
        });
        if (context.past5Conversations.length > 5) {
            context.past5Conversations.pop();
        }

        // 6. Improvement Pattern Logic
        if (context.past5Conversations.length >= 3) {
            const scores = context.past5Conversations.map(c => {
                const emotion = c.detectedEmotion;
                if (['Motivation', 'Calm', 'Power'].includes(emotion)) return 1;
                if (['Neutral', 'Clarity'].includes(emotion)) return 0;
                return -1;
            });

            const trendScore = scores.reduce((a, b) => a + b, 0);
            context.improvementPattern = {
                trend: trendScore > 0 ? 'improving' : trendScore < 0 ? 'declining' : 'stable',
                lastAnalyzed: new Date()
            };
        }

        await context.save();

        res.json({
            success: true,
            message: aiResponse,
            analysis: {
                dominantEmotion: context.dominantEmotion,
                confidence: analysis.confidence,
                language: analysis.language,
                mode: context.currentMode
            }
        });

    } catch (error) {
        console.error('AI Coach Chat Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

/**
 * Get User AI Context for Dashboard
 */
export const getAIContext = async (req, res) => {
    try {
        const { userId } = req.params;
        const context = await AIUserContext.findOne({ userId });
        res.json({ success: true, context });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching context' });
    }
};
