/**
 * riskEngine.js
 * 
 * Centralized logic for mental health risk assessment, 
 * breathing thresholds, and intervention triggers.
 */

export const RISK_THRESHOLDS = {
    STRESS_HIGH: 8,
    STRESS_SAD_WARNING: 7,
    BREATHING_DURATION: 60, // seconds
};

/**
 * Evaluates if a breathing intervention is needed based on mood and stress.
 * @param {string} mood 
 * @param {number} stressLevel 
 * @returns {boolean}
 */
export const shouldTriggerBreathing = (mood, stressLevel) => {
    if (typeof stressLevel !== 'number') return false;

    if (stressLevel >= RISK_THRESHOLDS.STRESS_HIGH) return true;
    if (mood?.toLowerCase() === 'sad' && stressLevel >= RISK_THRESHOLDS.STRESS_SAD_WARNING) return true;

    return false;
};

export const INTERVENTION_MESSAGE = "I notice your stress level is high. Let's pause for 60 seconds and breathe together.";
