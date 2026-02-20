import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../UI';
import { saveGuestMoodEntry } from '../../utils/guestMode';
import StressBreathingPopup from '../StressBreathingPopup';
import { RISK_THRESHOLDS, INTERVENTION_MESSAGE, shouldTriggerBreathing } from '../../utils/riskEngine';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Coins, Flame } from 'lucide-react';

const MoodModal = ({ isOpen, onClose }) => {
  const [selectedMood, setSelectedMood] = useState("");
  const [stressLevel, setStressLevel] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [showIntervention, setShowIntervention] = useState(false);
  const [rewards, setRewards] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { isAuthenticated } = useAuth();

  const moods = [
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '🤩', label: 'Great', value: 'great' },
  ];

  const generateFeedback = (mood, stress) => {
    const feedbackOptions = {
      tired: [
        "You seem tired. Try to get some rest today! 💤",
        "Consider a short nap or meditation session.",
      ],
      sad: [
        "I sense you might be feeling down. Remember, this feeling will pass! 💙",
        "Try talking to someone or engaging in an activity you enjoy.",
      ],
      neutral: [
        "You're in a balanced state. This is a good time for reflection. 🧘",
        "Consider journaling or trying a quick breathing exercise.",
      ],
      happy: [
        "You're in a great mood! Keep up this positive energy! ✨",
        "This is a perfect time to help others or set new goals.",
      ],
      great: [
        "Amazing! You're feeling fantastic! 🎉",
        "Cherish this feeling and spread positivity to others!",
      ],
    };

    const baseMsg = feedbackOptions[mood][0];
    const stressMsg = stress > 7 ? " Try a breathing exercise to reduce stress." : "";
    const secondMsg = feedbackOptions[mood][1];

    return `${baseMsg}${stressMsg}\n\n${secondMsg}`;
  };

  const handleSubmit = async () => {
    try {
      if (!selectedMood) return;
      setIsSubmitting(true);

      const generatedFeedback = generateFeedback(selectedMood, stressLevel);

      if (isAuthenticated) {
        // Authenticated user - call backend
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/mood/entry`, {
          mood: selectedMood,
          emotion: selectedMood,
          stressLevel: stressLevel ?? 0,
          description: 'Check-in from Modal'
        }, { withCredentials: true });

        if (response.data.success) {
          setRewards(response.data.rewards);
          setFeedback(generatedFeedback);
        }
      } else {
        // Guest user - original logic
        saveGuestMoodEntry({
          mood: selectedMood,
          emotion: selectedMood,
          stressLevel: stressLevel ?? 0,
          description: 'Check-in from Modal'
        });
        setFeedback(generatedFeedback);
      }

      setSubmitted(true);

      // LEVEL 1: High Stress Detection
      if (shouldTriggerBreathing(selectedMood, stressLevel)) {
        setShowIntervention(true);
      }
    } catch (error) {
      console.error("MoodModal Error:", error);
      alert("Failed to save mood entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedMood(null);
    setStressLevel(5);
    setSubmitted(false);
    setFeedback('');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">How are you feeling?</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {!submitted ? (
          <>
            {/* Mood Selection */}
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-4">Select your current mood</p>
              <div className="grid grid-cols-5 gap-3">
                {moods.map((mood) => (
                  <motion.button
                    key={mood.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg transition ${selectedMood === mood.value
                      ? 'bg-purple-100 ring-2 ring-purple-500'
                      : 'hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-xs text-gray-600">{mood.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Stress Level Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Stress Level</label>
                <span className="text-lg font-bold text-purple-600">{stressLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Calm</span>
                <span>Stressed</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={!selectedMood || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Processing..." : "Get AI Feedback"}
            </Button>
          </>
        ) : (
          <>
            {/* Feedback Screen */}
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-6xl mb-6"
              >
                {moods.find((m) => m.value === selectedMood)?.emoji}
              </motion.div>

              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                  {feedback}
                </p>
              </div>

              {rewards && (
                <div className="flex flex-col gap-3 mb-6">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center justify-between bg-yellow-50 border border-yellow-100 p-4 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-white shadow-md">
                        <Coins size={20} fill="currentColor" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-yellow-800">Tokens Earned</p>
                        <p className="text-xs text-yellow-600">Mental wellness bonus</p>
                      </div>
                    </div>
                    <p className="text-2xl font-black text-yellow-600">+{rewards.tokensEarned}</p>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-between bg-orange-50 border border-orange-100 p-4 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-md">
                        <Flame size={20} fill="currentColor" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-orange-800">Current Streak</p>
                        <p className="text-xs text-orange-600">Consistency is key!</p>
                      </div>
                    </div>
                    <p className="text-2xl font-black text-orange-600">{rewards.streak}d</p>
                  </motion.div>
                </div>
              )}

              {/* Access enabled for everyone */}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleReset}
                  className="w-full"
                >
                  New Check-in
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onClose}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Intervention Modal */}
      <StressBreathingPopup
        isOpen={showIntervention}
        onClose={() => setShowIntervention(false)}
        message={INTERVENTION_MESSAGE}
      />
    </motion.div>
  );
};

export default MoodModal;
