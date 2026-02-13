import { EMOTIONS_DATA } from './engineData.js';

export class EmotionEngine {
    constructor(customData = null) {
        this.emotions = customData || EMOTIONS_DATA;
    }

    detectLanguage(text) {
        // Detect Hindi using Devanagari character range
        const hindiRegex = /[\u0900-\u097F]/;
        return hindiRegex.test(text) ? 'hi' : 'en';
    }

    analyze(text) {
        const lang = this.detectLanguage(text);
        const cleanedText = text.toLowerCase().trim();

        let emotionScores = [];

        this.emotions.forEach(emotion => {
            let score = 0;
            let matchedKeywords = [];
            const keys = emotion.keywords[lang] || [];

            keys.forEach(k => {
                const word = k.word.toLowerCase();
                // Simple word boundary check
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                const matches = (cleanedText.match(regex) || []).length;

                if (matches > 0) {
                    score += (k.weight * matches);
                    matchedKeywords.push(word);
                }
            });

            if (score > 0) {
                emotionScores.push({
                    name: emotion.name,
                    score: score,
                    keywords: matchedKeywords,
                    mode: emotion.mode
                });
            }
        });

        // Sort by score descending
        emotionScores.sort((a, b) => b.score - a.score);

        // Calculate confidence based on the highest score relative to a threshold
        const maxScore = emotionScores.length > 0 ? emotionScores[0].score : 0;
        const confidence = Math.min(maxScore / 5, 1); // Normalize: score of 5 = 100% confidence

        return {
            language: lang,
            detectedEmotions: emotionScores,
            dominantEmotion: emotionScores.length > 0 ? emotionScores[0] : null,
            confidence: confidence,
            isMixed: emotionScores.length > 1 && (emotionScores[0].score - emotionScores[1].score < 2)
        };
    }
}
