import { GoogleGenerativeAI } from '@google/generative-ai';
import { MEDICAL_CONTEXT } from './engineData.js';
import dotenv from 'dotenv';

dotenv.config();

export class GeminiService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            // Defaulting to gemini-1.5-flash as it's balanced and fast
            this.model = this.genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: MEDICAL_CONTEXT.systemPrompt
            });
        }
    }

    async generateMedicalReflection(userMessage, analysis, pastConversations = []) {
        if (!this.model) {
            console.warn("Gemini API Key missing. Falling back to rule-based engine.");
            return null;
        }

        try {
            // Construct context for the AI
            const history = pastConversations.map(c =>
                `User: ${c.userMessage}\nAI: ${c.aiResponse}`
            ).join('\n');

            const prompt = `
            Detected Emotion: ${analysis.dominantEmotion?.name || 'Neutral'}
            Analysis Language: ${analysis.language}
            
            Context from past 5 interactions:
            ${history}
            
            CurrentUserMessage: "${userMessage}"
            
            TASK: 
            Provide a deep "Reflection" and "Insight" specifically for a medical professional. 
            - Reflection: Deeply mirrors their struggle (burnout, exhaustion, etc.) in a way a senior colleague would.
            - Insight: Provides a small perspective shift or validation of their role.
            
            Keep the response concise (max 3-4 sentences). 
            Response should be in the ${analysis.language === 'hi' ? 'Hindi (mix with professional English if natural)' : 'English'}.
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error("Gemini Generation Error:", error);
            return null;
        }
    }
}
