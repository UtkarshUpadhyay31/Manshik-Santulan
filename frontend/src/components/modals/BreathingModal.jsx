import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../UI';

const BreathingModal = ({ isOpen, onClose }) => {
  const [stage, setStage] = useState('breathing'); // breathing, complete
  const [breathingCycle, setBreathingCycle] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(240); // 4 minutes
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  const BREATHING_PATTERN = {
    inhale: 4,
    hold: 4,
    exhale: 6,
  };

  const TOTAL_CYCLE_TIME = BREATHING_PATTERN.inhale + BREATHING_PATTERN.hold + BREATHING_PATTERN.exhale;

  // Initialize Audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/breathing-bg.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  // Handle Fade Logic
  const fadeAudio = (targetVolume) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const step = 0.025;
    const intervalTime = 50; // Fade time approx 0.5s

    fadeIntervalRef.current = setInterval(() => {
      const currentVol = audioRef.current.volume;
      if (Math.abs(currentVol - targetVolume) < step) {
        audioRef.current.volume = targetVolume;
        clearInterval(fadeIntervalRef.current);
        if (targetVolume === 0 && audioRef.current) {
          audioRef.current.pause();
        }
      } else {
        const nextVol = currentVol < targetVolume ? currentVol + step : currentVol - step;
        audioRef.current.volume = Math.max(0, Math.min(1, nextVol));
      }
    }, intervalTime);
  };

  // Sync Audio with Exercise State
  useEffect(() => {
    if (!audioRef.current) return;

    if (isActive && soundEnabled && stage === 'breathing' && isOpen) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsAudioBlocked(true);
        });
      }
      fadeAudio(0.25);
    } else {
      fadeAudio(0);
    }
  }, [isActive, soundEnabled, stage, isOpen]);

  useEffect(() => {
    if (!isActive || stage !== 'breathing') return;

    const interval = setInterval(() => {
      setBreathingCycle((prev) => (prev + 1) % (TOTAL_CYCLE_TIME * 10));
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setStage('complete');
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, stage]);

  const getBreathingPhase = () => {
    const cycle = (breathingCycle / 10) % TOTAL_CYCLE_TIME;
    if (cycle < BREATHING_PATTERN.inhale) return 'inhale';
    if (cycle < BREATHING_PATTERN.inhale + BREATHING_PATTERN.hold) return 'hold';
    return 'exhale';
  };

  const getBreathingScale = () => {
    const cycle = (breathingCycle / 10) % TOTAL_CYCLE_TIME;
    const phase = getBreathingPhase();

    if (phase === 'inhale') {
      return 1 + (cycle / BREATHING_PATTERN.inhale) * 0.5;
    } else if (phase === 'hold') {
      return 1.5;
    } else {
      const exhaleProgress = (cycle - BREATHING_PATTERN.inhale - BREATHING_PATTERN.hold) / BREATHING_PATTERN.exhale;
      return 1.5 - exhaleProgress * 0.5;
    }
  };

  const getPhaseText = () => {
    const phase = getBreathingPhase();
    const phases = {
      inhale: 'Breathe In...',
      hold: 'Hold...',
      exhale: 'Breathe Out...',
    };
    return phases[phase];
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    setIsAudioBlocked(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2.5rem] p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Breathing Exercise</h2>
          <div className="flex gap-2">
            <button
              onClick={toggleSound}
              className={`p-3 rounded-2xl transition-all duration-300 ${soundEnabled ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-400'}`}
              title={soundEnabled ? "Mute" : "Unmute"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={onClose}
              className="p-3 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {stage === 'breathing' ? (
          <>
            {/* Breathing Circle */}
            <div className="flex flex-col items-center justify-center mb-10">
              <div className="relative">
                <motion.div
                  animate={{ scale: getBreathingScale() }}
                  transition={{ duration: 0.1, ease: 'linear' }}
                  className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_20px_50px_rgba(99,102,241,0.3)] flex items-center justify-center mb-10 relative z-10"
                >
                  <div className="text-center">
                    <p className="text-white text-lg font-bold tracking-wide">{getPhaseText()}</p>
                  </div>
                </motion.div>
                {/* Visual Ambient Rings */}
                <motion.div
                  animate={{ scale: getBreathingScale() * 1.2, opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-purple-200 -z-10"
                />
              </div>

              {/* Guidance Text */}
              <div className="text-center mb-8">
                <p className="text-slate-500 text-sm font-medium mb-3">Sync your breath with the flow</p>
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-900 text-white font-mono text-2xl font-bold shadow-xl shadow-slate-900/10">
                  {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
                </div>
              </div>

              {isAudioBlocked && isActive && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={toggleSound}
                  className="mb-6 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-xs font-bold animate-pulse"
                >
                  Tap to enable calming sound
                </motion.button>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 mb-8 border border-white">
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                We're using the <strong>4-4-6 technique</strong> to help calm your nervous system.
                Inhale for 4s, hold for 4s, and exhale for 6s.
              </p>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              {!isActive ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsActive(true)}
                  className="w-full rounded-[1.25rem] py-4 bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/20"
                >
                  Start Exercise
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setIsActive(false)}
                  className="w-full rounded-[1.25rem] py-4"
                >
                  Pause
                </Button>
              )}
              <Button
                variant="ghost"
                size="lg"
                onClick={onClose}
                className="w-full rounded-[1.25rem] py-4 text-slate-500"
              >
                Exit
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Completion Screen */}
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2rem] shadow-xl shadow-emerald-500/20 flex items-center justify-center mx-auto mb-8"
              >
                <span className="text-5xl text-white">✓</span>
              </motion.div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Beautifully Done.</h3>
              <p className="text-slate-500 mb-10 leading-relaxed text-lg font-medium">
                You've successfully completed your breathing ritual. Carry this calm with you.
              </p>
              <div className="bg-emerald-50 rounded-3xl p-6 mb-10 border border-white">
                <p className="text-sm text-emerald-800 font-medium">
                  <strong>Daily Tip:</strong> Small, consistent moments of breathing build lasting resilience. Come back anytime you feel overwhelmed.
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={onClose}
                className="w-full rounded-[1.25rem] py-4 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20"
              >
                Keep the Calm
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BreathingModal;

