import { CRISIS_KEYWORDS } from './engineData.js';

export class CrisisLayer {
    constructor(customKeywords = null) {
        this.keywords = customKeywords || CRISIS_KEYWORDS;
    }

    detect(text) {
        const cleanedText = text.toLowerCase().trim();
        const langDetection = /[\u0900-\u097F]/.test(text) ? 'hi' : 'en';
        for (const category in this.keywords) {
            const keys = this.keywords[category][langDetection] || [];
            for (const word of keys) {
                if (cleanedText.includes(word.toLowerCase())) {
                    return {
                        isCrisis: true,
                        trigger: word,
                        message: this.getEmergencyResponse(langDetection)
                    };
                }
            }
        }

        return { isCrisis: false };
    }

    getEmergencyResponse(lang) {
        return lang === 'hi'
            ? "मैं वास्तव में आपकी बातों से चिंतित हूं। कृपया जानें कि आप अकेले नहीं हैं। आप तुरंत एक भरोसेमंद व्यक्ति से बात करें या हेल्पलाइन 9152987821 (Vandrevala Foundation) पर कॉल करें। मैं एक AI हूं और पेशेवर मदद की जगह नहीं ले सकता।"
            : "I'm really concerned about what you're sharing. Please know that you're not alone. Reach out to a trusted person immediately or call the iCall helpline at 9152987821. I am an AI and cannot provide professional medical or crisis intervention.";
    }
}
