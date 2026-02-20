import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { motion } from 'framer-motion';
import { Camera, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { Card, Button } from './UI';
import { useUIStore } from '../context/store';

const EMOTION_LABELS = ['happy', 'sad', 'angry', 'neutral', 'surprised'];

const EMOJI_MAP = {
  happy: '\uD83D\uDE0A',
  sad: '\uD83D\uDE14',
  angry: '\uD83D\uDE20',
  neutral: '\uD83D\uDE0C',
  surprised: '\uD83D\uDE2E'
};

const GLOW_MAP = {
  happy: 'rgba(16, 185, 129, 0.45)',
  sad: 'rgba(59, 130, 246, 0.45)',
  angry: 'rgba(239, 68, 68, 0.45)',
  neutral: 'rgba(99, 102, 241, 0.35)',
  surprised: 'rgba(245, 158, 11, 0.5)'
};

const MODEL_URL = '/models';
const ANALYSIS_INTERVAL = 180;

const AIEmotionMirror = () => {
  const { isCrisisMode } = useUIStore();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const lastRunRef = useRef(0);
  const isAnalyzingRef = useRef(false);
  const videoReadyRef = useRef(false);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [emotionScores, setEmotionScores] = useState(() =>
    EMOTION_LABELS.reduce((acc, label) => ({ ...acc, [label]: 0 }), {})
  );
  const [noFace, setNoFace] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const dominantEmotion = useMemo(() => {
    let best = 'neutral';
    let bestValue = 0;
    EMOTION_LABELS.forEach((label) => {
      if (emotionScores[label] > bestValue) {
        bestValue = emotionScores[label];
        best = label;
      }
    });
    return best;
  }, [emotionScores]);

  const confidence = useMemo(() => {
    const max = Math.max(...EMOTION_LABELS.map((label) => emotionScores[label]));
    return Math.round(max * 100);
  }, [emotionScores]);

  const loadModels = async () => {
    if (modelsLoaded) return true;
    if (isModelLoading) return false;
    setIsModelLoading(true);
    setError('');

    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
      setModelsLoaded(true);
      return true;
    } catch (err) {
      console.error('Failed to load face model:', err);
      setError('Unable to load emotion model. Please refresh and try again.');
      return false;
    } finally {
      setIsModelLoading(false);
    }
  };

  const stopCamera = () => {
    isAnalyzingRef.current = false;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    videoReadyRef.current = false;
    setVideoReady(false);
    setIsAnalyzing(false);
  };

  const runAnalysisLoop = () => {
    const analyze = async (timestamp) => {
      if (!videoRef.current || !isAnalyzingRef.current) return;

      if (!videoReadyRef.current || videoRef.current.readyState < 2) {
        animationRef.current = requestAnimationFrame(analyze);
        return;
      }

      if (timestamp - lastRunRef.current < ANALYSIS_INTERVAL) {
        animationRef.current = requestAnimationFrame(analyze);
        return;
      }
      lastRunRef.current = timestamp;

      try {
        const detection = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.3 })
          )
          .withFaceExpressions();

        if (!detection?.expressions) {
          setNoFace(true);
          animationRef.current = requestAnimationFrame(analyze);
          return;
        }

        setNoFace(false);
        const expr = detection.expressions;
        const filtered = {
          happy: expr.happy || 0,
          sad: expr.sad || 0,
          angry: expr.angry || 0,
          neutral: expr.neutral || 0,
          surprised: expr.surprised || 0
        };

        const total = Object.values(filtered).reduce((sum, value) => sum + value, 0) || 1;
        const normalized = Object.fromEntries(
          Object.entries(filtered).map(([key, value]) => [key, value / total])
        );
        setEmotionScores(normalized);
      } catch (err) {
        console.error('Emotion detection failed:', err);
      }

      animationRef.current = requestAnimationFrame(analyze);
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(analyze);
  };

  const startCamera = async () => {
    if (!videoRef.current) return;
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      await new Promise((resolve) => {
        if (!videoRef.current) {
          resolve();
          return;
        }
        videoRef.current.onloadedmetadata = () => resolve();
      });

      await videoRef.current.play();

      videoReadyRef.current = true;
      isAnalyzingRef.current = true;
      setVideoReady(true);
      setIsAnalyzing(true);
      runAnalysisLoop();
    } catch (err) {
      console.error('Camera permission denied:', err);
      setError('Camera access denied. Please allow camera permission to continue.');
      isAnalyzingRef.current = false;
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeClick = async () => {
    if (isAnalyzingRef.current) {
      stopCamera();
      return;
    }

    const ready = await loadModels();
    if (!ready) return;
    await startCamera();
  };

  useEffect(() => {
    if (isCrisisMode && isAnalyzing) {
      stopCamera();
    }
  }, [isCrisisMode, isAnalyzing]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (isCrisisMode) return null;

  return (
    <Card className="relative overflow-hidden border border-emerald-100">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-indigo-50 opacity-80" />
      <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">AI Emotional Mirror</h3>
              <p className="text-sm text-slate-500">
                Real-time emotion insights to help you reflect and reset.
              </p>
            </div>
          </div>

          <div className="relative bg-white/80 rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="aspect-video rounded-xl bg-slate-900/90 flex items-center justify-center text-white overflow-hidden">
              <video ref={videoRef} className="w-full h-full object-cover" muted playsInline autoPlay />
              {!isAnalyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4">
                  <Camera size={28} className="text-emerald-200" />
                  <p className="text-sm text-slate-100">
                    Enable camera and let the AI mirror your emotions.
                  </p>
                </div>
              )}
            </div>
            {noFace && isAnalyzing && (
              <p className="text-xs text-slate-500 mt-3">No face detected. Move into view for best results.</p>
            )}
            {!noFace && isAnalyzing && !videoReady && (
              <p className="text-xs text-slate-500 mt-3">Preparing video stream...</p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6">
          <div className="bg-white/90 rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-500">Dominant Emotion</p>
                <p className="text-xl font-bold text-slate-900 capitalize">{dominantEmotion}</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  boxShadow: `0 0 28px ${GLOW_MAP[dominantEmotion]}`
                }}
              >
                {EMOJI_MAP[dominantEmotion]}
              </motion.div>
            </div>

            <div className="space-y-3">
              {EMOTION_LABELS.map((label) => {
                const percent = Math.round((emotionScores[label] || 0) * 100);
                return (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-20 text-sm capitalize text-slate-600">{label}</div>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-indigo-400"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-500 w-10 text-right">{percent}%</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Confidence</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-emerald-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-emerald-600">{confidence}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            {isModelLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-white/80 border border-slate-100 rounded-lg p-3">
                <Loader2 size={16} className="animate-spin" />
                Loading emotion model...
              </div>
            )}
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleAnalyzeClick}
              className="w-full bg-gradient-to-r from-emerald-500 to-indigo-500 hover:shadow-emerald-400/40"
              isLoading={isModelLoading}
            >
              {isAnalyzing ? 'Stop Analysis' : 'Analyze My Mood'}
            </Button>
            <p className="text-xs text-slate-500">
              Your camera stays on-device. No paid APIs or external uploads.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIEmotionMirror;
