import { EMOTIONS_DATA, GLOBAL_TEMPLATES } from './engineData.js';
import { GeminiService } from './GeminiService.js';

export class ResponseGenerator {
    constructor(customData = null) {
        this.emotions = customData || EMOTIONS_DATA;
        this.humorLevel = 0.3; // Slight intelligent humor
        this.gemini = new GeminiService();
    }

    async generate(analysis, userProfile = {}, pastConversations = []) {
        const { dominantEmotion, language } = analysis;

        if (!dominantEmotion) {
            return this.getRandom(GLOBAL_TEMPLATES.fallback, language);
        }

        const emotionConfig = this.emotions.find(e => e.name === dominantEmotion.name);
        if (!emotionConfig) return this.getRandom(GLOBAL_TEMPLATES.fallback, language);

        const templates = emotionConfig.templates;
        const userName = userProfile.firstName || (language === 'hi' ? 'दोस्त' : 'friend');

        // Step 1: Emotional validation (Rule-based for immediate empathy)
        const val = this.getRandom(templates.validation, language);

        // Hybrid Approach: Use Gemini for deep medical reflection if possible
        let refAndIns = "";
        const medicalGeminiResponse = await this.gemini.generateMedicalReflection(
            analysis.userMessage || "",
            analysis,
            pastConversations
        );

        if (medicalGeminiResponse) {
            refAndIns = medicalGeminiResponse;
        } else {
            // Step 2 & 3: Fallback Reflection & Mini insight (Rule-based)
            let ref = this.getRandom(templates.reflection, language);
            ref = ref.replace(/{trigger}/g, dominantEmotion.keywords[0] || 'your feelings');
            const ins = this.getRandom(templates.insight, language);
            refAndIns = `${ref} ${ins}`;
        }

        // Step 4: Small practical step (Rule-based)
        const act = this.getRandom(templates.action, language);

        // Step 5: Gentle follow-up question (Rule-based)
        const fol = this.getRandom(templates.followUp, language);

        // Combine with Grok-style "wise friend" tone
        const response = `${this.getGreeting(userName, language)} ${val} ${refAndIns} ${act} ${fol}`;

        return response;
    }

    getGreeting(name, lang) {
        if (lang === 'hi') {
            return `नमस्ते ${name}! 👋 `;
        }
        return `Hey ${name}! 👋 `;
    }

    getRandom(obj, lang = 'en') {
        if (!obj) return "...";
        const items = obj[lang] || obj['en'] || [];
        if (items.length === 0) return "...";
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    }
}
