import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../UI';
import { saveGuestMoodEntry } from '../../utils/guestMode';

const MoodCheckModal = ({ isOpen, onClose }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [stressLevel, setStressLevel] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

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

  const handleSubmit = () => {
    if (!selectedMood) return;

    const generatedFeedback = generateFeedback(selectedMood, stressLevel);
    setFeedback(generatedFeedback);

    // Save to guest mode
    saveGuestMoodEntry({
      mood: selectedMood,
      emotion: selectedMood,
      stressLevel,
      description: 'Check-in from Modal'
    });

    setSubmitted(true);
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
              disabled={!selectedMood}
              className="w-full"
            >
              Get AI Feedback
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
    </motion.div>
  );
};

export default MoodCheckModal;
