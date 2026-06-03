import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Button, Card } from '../components/UI';
import { 
  Sparkles, Heart, Activity, Brain, Wind, Play, Pause, 
  Volume2, VolumeX, Clock, ArrowRight, ArrowLeft,
  CheckCircle, Moon, Compass, HelpCircle, Smile, 
  Flame, BookOpen, ChevronRight, Info, X, ChevronLeft, AlertTriangle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Custom SVGs for Herb illustrations to look premium
const AshwagandhaSVG = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto drop-shadow-md text-emerald-600 fill-current">
    <path d="M50,15 C52,25 45,35 48,45 C52,50 58,45 62,40 C65,35 62,25 60,18 C58,25 55,28 50,15 Z" opacity="0.8" />
    <path d="M50,45 C48,55 52,62 48,72 C44,78 38,72 34,68 C30,64 32,54 36,48 C38,55 42,56 50,45 Z" opacity="0.9" />
    <path d="M48,45 C38,45 32,38 25,42 C20,45 22,52 28,55 C34,58 40,52 48,45 Z" opacity="0.75" />
    <path d="M52,45 C62,45 68,38 75,42 C80,45 78,52 72,55 C66,58 60,52 52,45 Z" opacity="0.75" />
    <path d="M50,43 L50,90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="50" cy="90" r="4" className="text-amber-700" />
    <circle cx="48" cy="72" r="3" className="text-amber-500" />
    <circle cx="53" cy="55" r="3.5" className="text-amber-500" />
  </svg>
);

const BrahmiSVG = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto drop-shadow-md text-teal-600 fill-current">
    <circle cx="35" cy="40" r="18" opacity="0.6" />
    <circle cx="65" cy="40" r="18" opacity="0.6" />
    <circle cx="50" cy="65" r="20" opacity="0.7" />
    <path d="M50,30 L50,85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M35,40 Q50,55 65,40" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="35" cy="40" r="4" className="text-white" />
    <circle cx="65" cy="40" r="4" className="text-white" />
    <circle cx="50" cy="65" r="4" className="text-white" />
  </svg>
);

const TulsiSVG = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto drop-shadow-md text-emerald-700 fill-current">
    <path d="M50,90 L50,20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M50,40 Q30,30 25,45 Q25,60 50,55" opacity="0.8" />
    <path d="M50,55 Q70,45 75,60 Q75,75 50,70" opacity="0.85" />
    <path d="M50,25 Q35,15 30,28 Q30,40 50,35" opacity="0.75" />
    <path d="M50,35 Q65,25 70,38 Q70,50 50,45" opacity="0.75" />
    {/* Purple flowers */}
    <ellipse cx="50" cy="18" rx="3" ry="5" className="text-purple-500" />
    <ellipse cx="50" cy="10" rx="2" ry="4" className="text-purple-400" />
    <circle cx="47" cy="14" r="2" className="text-purple-300" />
    <circle cx="53" cy="14" r="2" className="text-purple-300" />
  </svg>
);

const ShankhpushpiSVG = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto drop-shadow-md text-indigo-500 fill-current">
    {/* Blue morning glory flowers */}
    <path d="M50,50 C40,40 30,55 35,65 C40,75 50,70 50,50 Z" opacity="0.8" />
    <circle cx="35" cy="55" r="8" className="text-blue-400" />
    <circle cx="65" cy="45" r="9" className="text-blue-400" />
    <path d="M50,50 C60,40 70,55 65,65 C60,75 50,70 50,50 Z" opacity="0.8" />
    <ellipse cx="50" cy="35" rx="14" ry="10" className="text-indigo-400" opacity="0.7" />
    <circle cx="50" cy="35" r="4" className="text-yellow-300" />
    <path d="M50,35 L50,90" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const JatamansiSVG = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto drop-shadow-md text-slate-600 fill-current">
    <path d="M50,90 Q40,65 50,45 Q60,65 50,90 Z" opacity="0.8" className="text-amber-800" />
    <path d="M45,90 Q30,75 42,65" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-amber-900" />
    <path d="M55,90 Q70,75 58,65" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-amber-900" />
    <path d="M50,45 L50,15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-600" />
    {/* Spiky root fibers and small pink flowers at top */}
    <circle cx="50" cy="15" r="4" className="text-pink-400" />
    <circle cx="45" cy="18" r="3" className="text-pink-300" />
    <circle cx="55" cy="18" r="3" className="text-pink-300" />
    <path d="M50,45 C35,40 38,25 40,20" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-emerald-500" />
    <path d="M50,45 C65,40 62,25 60,20" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-emerald-500" />
  </svg>
);

const HealingWellness = () => {
  const navigate = useNavigate();

  // Scroll Refs for Hero CTAs
  const yogaSectionRef = useRef(null);
  const ayurvedaSectionRef = useRef(null);
  const timelineSectionRef = useRef(null);
  const moodSectionRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Section 2: Yoga Category Filters
  const [activeYogaFilter, setActiveYogaFilter] = useState('All');
  const [selectedYoga, setSelectedYoga] = useState(null); // for watch routine modal
  
  const yogaFilters = ['All', 'Stress', 'Anxiety', 'Sleep', 'Focus', 'Relaxation'];
  
  const yogaPoses = [
    {
      id: 'anulom',
      name: 'Anulom Vilom',
      sanskrit: 'Alternate Nostril Breathing',
      benefit: 'Anxiety relief & nerve balancing',
      category: 'Anxiety',
      difficulty: 'Beginner',
      duration: '5 min',
      icon: Wind,
      steps: [
        'Sit comfortably with your spine straight and shoulders relaxed.',
        'Rest your left hand on your left knee, palm open to the sky.',
        'Use your right thumb to close your right nostril. Inhale deeply through your left nostril.',
        'Close the left nostril with your ring finger, release the thumb, and exhale fully through the right nostril.',
        'Inhale through the right nostril, then close it and exhale through the left nostril.',
        'Repeat this cycle, keeping breaths slow, smooth, and quiet.'
      ],
      color: 'from-blue-400 to-indigo-500',
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto stroke-blue-500" fill="none" strokeWidth="2">
          <circle cx="50" cy="50" r="40" strokeDasharray="5 5" opacity="0.3" />
          <path d="M50,15 C30,30 30,70 50,85" />
          <path d="M50,15 C70,30 70,70 50,85" />
          <path d="M50,15 L50,85" opacity="0.5" />
          <circle cx="50" cy="15" r="4" fill="currentColor" className="text-blue-500" />
          <path d="M35,50 L40,55 L45,45" strokeWidth="3" />
          <path d="M65,50 L60,55 L55,45" strokeWidth="3" />
        </svg>
      )
    },
    {
      id: 'balasana',
      name: 'Balasana',
      sanskrit: "Child's Pose",
      benefit: 'Stress reduction & calming focus',
      category: 'Stress',
      difficulty: 'Beginner',
      duration: '3 min',
      icon: Heart,
      steps: [
        'Kneel on the floor, touching your big toes together and sitting back on your heels.',
        'Separate your knees about as wide as your hips.',
        'Exhale and lay your torso down between your thighs, stretching your spine forward.',
        'Rest your forehead gently on the mat or a folded blanket.',
        'Stretch your arms forward with palms down, or lay them back along your thighs with palms up.',
        'Let your shoulders relax completely. Hold for 3-5 minutes, breathing into your lower back.'
      ],
      color: 'from-purple-400 to-pink-500',
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto stroke-purple-500" fill="none" strokeWidth="2">
          <path d="M10,80 L90,80" strokeDasharray="3 3" />
          <path d="M20,80 Q35,55 50,75 Q65,65 80,80" strokeWidth="3" />
          <circle cx="80" cy="70" r="5" fill="currentColor" className="text-purple-500" />
          <path d="M40,80 C30,75 25,65 30,55 C35,45 50,45 60,60" />
        </svg>
      )
    },
    {
      id: 'bhramari',
      name: 'Bhramari Pranayama',
      sanskrit: 'Humming Bee Breath',
      benefit: 'Calms overthinking & releases anger',
      category: 'Relaxation',
      difficulty: 'Beginner',
      duration: '4 min',
      icon: Smile,
      steps: [
        'Sit comfortably, close your eyes, and bring a gentle smile to your face.',
        'Place your index fingers on the cartilage of your ears.',
        'Take a deep breath in through your nose.',
        'As you exhale, gently press the ear cartilage and make a loud, steady humming sound like a bee.',
        'Keep your mouth closed and feel the vibrations echo throughout your skull and chest.',
        'Repeat 5 to 8 times, keeping your awareness on the internal vibration.'
      ],
      color: 'from-amber-400 to-orange-500',
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto stroke-amber-500" fill="none" strokeWidth="2">
          <circle cx="50" cy="50" r="25" />
          <path d="M50,25 C50,15 35,20 35,10" />
          <path d="M50,25 C50,15 65,20 65,10" />
          {/* Humming waves */}
          <path d="M15,50 Q20,40 25,50 T35,50" />
          <path d="M85,50 Q80,40 75,50 T65,50" />
          <circle cx="50" cy="45" r="3" fill="currentColor" className="text-amber-500" />
          <path d="M45,55 Q50,60 55,55" />
        </svg>
      )
    },
    {
      id: 'surya',
      name: 'Surya Namaskar',
      sanskrit: 'Sun Salutation',
      benefit: 'Mood enhancement & physical vitality',
      category: 'Focus',
      difficulty: 'Intermediate',
      duration: '10 min',
      icon: Activity,
      steps: [
        'Pranamasana (Prayer Pose): Stand at the edge of your mat, feet together, palms joined at your chest.',
        'Hastauttanasana (Raised Arms Pose): Inhale, stretch your arms up and arch slightly backward.',
        'Padahastasana (Hand to Foot Pose): Exhale, bend forward from the waist, bringing hands down to touch the feet.',
        'Ashwa Sanchalanasana (Equestrian Pose): Inhale, push your right leg back, drop right knee, look up.',
        'Dandasana (Plank Pose): Step left leg back, keep body in a straight line.',
        'Ashtanga Namaskara (Salute with Eight Points): Drop knees, chest, and chin to floor, hips elevated.',
        'Bhujangasana (Cobra Pose): Slide forward, raise chest, arch back looking up.',
        'Adho Mukha Svanasana (Downward Dog): Exhale, lift hips up, forming an inverted V-shape.',
        'Step right foot forward, step left foot forward, stand up inhaling, and return to prayer pose.'
      ],
      color: 'from-rose-400 to-red-500',
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto stroke-rose-500" fill="none" strokeWidth="2">
          <circle cx="50" cy="50" r="16" strokeWidth="3" className="text-rose-500" />
          {/* Sun rays */}
          <path d="M50,15 L50,25" />
          <path d="M50,75 L50,85" />
          <path d="M15,50 L25,50" />
          <path d="M75,50 L85,50" />
          <path d="M25,25 L32,32" />
          <path d="M68,68 L75,75" />
          <path d="M75,25 L68,32" />
          <path d="M32,68 L25,75" />
        </svg>
      )
    },
    {
      id: 'shavasana',
      name: 'Shavasana',
      sanskrit: 'Corpse Pose',
      benefit: 'Deep sleep prep & absolute relaxation',
      category: 'Sleep',
      difficulty: 'Beginner',
      duration: '8 min',
      icon: Moon,
      steps: [
        'Lie flat on your back, legs spread comfortably apart and feet splayed out to the sides.',
        'Place your arms slightly away from your torso, with palms facing up to receive calm energy.',
        'Tuck your shoulder blades slightly to lift your chest, then relax completely.',
        'Close your eyes and take 3 deep sighs, releasing all muscle tension on each exhale.',
        'Allow your breathing to become completely effortless, shallow, and natural.',
        'Mentally scan your body from toes to head, releasing any hidden pockets of tightness.',
        'Remain completely still for 8-15 minutes, allowing thoughts to float by like clouds.'
      ],
      color: 'from-emerald-400 to-teal-500',
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto stroke-emerald-500" fill="none" strokeWidth="2">
          <path d="M20,50 L80,50" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="40" r="6" fill="currentColor" className="text-emerald-500" />
          <path d="M25,50 L20,60" />
          <path d="M75,50 L80,60" />
          <path d="M40,50 Q50,30 60,50" opacity="0.3" strokeDasharray="3 3" />
        </svg>
      )
    }
  ];

  const filteredYogaPoses = useMemo(() => {
    if (activeYogaFilter === 'All') return yogaPoses;
    return yogaPoses.filter(pose => pose.category === activeYogaFilter);
  }, [activeYogaFilter]);

  // Section 3: Ayurvedic Herbs
  const [selectedHerb, setSelectedHerb] = useState(null);

  const herbs = [
    {
      id: 'ashwagandha',
      name: 'Ashwagandha',
      scientific: 'Withania Somnifera',
      tagline: 'The Supreme Adaptogen',
      benefits: 'Reduces stress hormones, combats chronic fatigue, and improves cognitive resiliency under pressure.',
      usage: 'Blend 1/2 teaspoon of organic root powder with warm milk, a pinch of nutmeg, and honey. Consume 45 minutes before sleep.',
      precautions: 'Do not use during pregnancy, active fever, or if taking high-dose thyroid medications. Consult your physician first.',
      desc: 'Ashwagandha is highly revered in Ayurvedic medicine for its powerful ability to balance Vata and Kapha doshas, offering calming structural support.',
      icon: AshwagandhaSVG
    },
    {
      id: 'brahmi',
      name: 'Brahmi',
      scientific: 'Bacopa Monnieri',
      tagline: 'The Herb of Grace & Wisdom',
      benefits: 'Nourishes brain cells, boosts short-term memory, calms mental friction, and reduces anxiety-induced palpitations.',
      usage: 'Infuse 1-2 fresh leaves in warm water for 5 minutes as tea, or consume 1 organic capsule (500mg) with a glass of water in the morning.',
      precautions: 'May cause mild stomach cramping if consumed on an empty stomach. Avoid taking alongside heavy sedatives.',
      desc: 'Brahmi cools the mind and directly targets the nervous system, helping to balance Sadhaka Pitta, which governs emotions and intelligence.',
      icon: BrahmiSVG
    },
    {
      id: 'tulsi',
      name: 'Tulsi (Holy Basil)',
      scientific: 'Ocimum Tenuiflorum',
      tagline: 'The Elixir of Life',
      benefits: 'Clears breathing passages, relieves emotional congestion, helps adapt to environmental stress, and lifts low mood.',
      usage: 'Brew 5-6 fresh Tulsi leaves in hot water for 7 minutes. Sip slowly with a drop of organic honey, twice daily.',
      precautions: 'Has mild blood-thinning properties. Avoid if currently on anti-coagulants or undergoing dental procedures.',
      desc: 'Tulsi is regarded as a goddess in plant form. It clears the aura, warms the body, balances Kapha/Vata, and promotes emotional lightness.',
      icon: TulsiSVG
    },
    {
      id: 'shankhpushpi',
      name: 'Shankhpushpi',
      scientific: 'Convolvulus Pluricaulis',
      tagline: 'The Intellect Rejuvenator',
      benefits: 'Alleviates brain fog, reduces nervous exhaustion, controls tension headaches, and stabilizes hyper-active thoughts.',
      usage: 'Take 2 teaspoons of herbal syrup with warm milk, or mix 1 gram of powder with raw honey after breakfast.',
      precautions: 'May lower blood pressure. Use with caution if you naturally have low blood pressure (hypotension).',
      desc: 'Shankhpushpi is a powerful Medhya Rasayana (brain tonic) that directly cools the nervous system and balances Pitta/Vata.',
      icon: ShankhpushpiSVG
    },
    {
      id: 'jatamansi',
      name: 'Jatamansi',
      scientific: 'Nardostachys Jatamansi',
      tagline: 'The Natural Tranquilizer',
      benefits: 'Promotes deep Delta sleep, eases panic attacks, grounds unstable emotions, and combats nervous hysteria.',
      usage: 'Mix 1 gram of Jatamansi powder with warm water or ghee, and consume at bedtime to calm hyper-excitability.',
      precautions: 'Can cause mild sluggishness if taken in excessive quantities. Avoid long-term daily use without professional monitoring.',
      desc: 'Jatamansi has cooling, anchoring qualities that calm the mind and pacify all three doshas, especially aggravated Vata.',
      icon: JatamansiSVG
    }
  ];

  // Section 4: Daily Healing Routine (Interactive Timeline)
  const [completedRoutineSteps, setCompletedRoutineSteps] = useState({});

  const routineSteps = [
    {
      id: 'step1',
      time: '06:30 AM',
      title: 'Morning Mindfulness',
      desc: 'Sit quietly for 5 minutes. Set a calming intention for the day and note 3 things you are grateful for.',
      type: 'mind'
    },
    {
      id: 'step2',
      time: '07:30 AM',
      title: 'Hydration & Herb Infusion',
      desc: 'Drink a glass of warm water to wake up digestion, followed by warm Tulsi tea for adaptive energy.',
      type: 'body'
    },
    {
      id: 'step3',
      time: '11:00 AM',
      title: 'Midday Resettling',
      desc: 'Stop all work. Perform 2 minutes of alternate nostril breathing (Anulom Vilom) to stabilize cortisol levels.',
      type: 'breath'
    },
    {
      id: 'step4',
      time: '01:30 PM',
      title: 'Conscious Nourishment',
      desc: 'Eat a warm, freshly cooked meal mindfully. Do not browse your phone. Taste each bite and breathe deeply.',
      type: 'diet'
    },
    {
      id: 'step5',
      time: '05:30 PM',
      title: 'Digital Grounding Walk',
      desc: 'Put your phone on silent. Walk outside on the grass or soil for 15 minutes to ground static nervous energies.',
      type: 'nature'
    },
    {
      id: 'step6',
      time: '08:00 PM',
      title: 'Journaling & Gratitude',
      desc: 'Write down three positive events or minor victories from today to re-wire your brain for peace.',
      type: 'mind'
    },
    {
      id: 'step7',
      time: '09:30 PM',
      title: 'Bedtime Calming',
      desc: 'Practice 4-5 rounds of Humming Bee breath (Bhramari), then lie in Shavasana to transition into deep sleep.',
      type: 'sleep'
    }
  ];

  const toggleRoutineStep = (id) => {
    setCompletedRoutineSteps(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const progressPercentage = useMemo(() => {
    const completedCount = Object.values(completedRoutineSteps).filter(Boolean).length;
    return Math.round((completedCount / routineSteps.length) * 100);
  }, [completedRoutineSteps]);

  // Section 5: Mood-Based Recommendation AI
  const [selectedMood, setSelectedMood] = useState(null);

  const moodRecommendations = {
    Stress: {
      yoga: 'Balasana (Child\'s Pose)',
      activity: 'Take a hot lavender-infused bath and unplug your routers.',
      meditation: 'Soham Mantra: Close your eyes and silently chant "So" on inhale, "Ham" on exhale.',
      sleep: 'Sleep with a weighted blanket; keep room temperature at a cool 19°C.',
      affirmation: '"I let go of what I cannot control. I am grounded, safe, and supported."',
      ayurveda: 'Enjoy a warm cup of Golden Milk with 1/2 tsp of Ashwagandha before bed.'
    },
    Anxiety: {
      yoga: 'Anulom Vilom (Nostril Breathing)',
      activity: 'Perform the 5-4-3-2-1 grounding technique immediately.',
      meditation: 'Box Breathing: Inhale 4s, Hold 4s, Exhale 4s, Hold 4s. Repeat 5 times.',
      sleep: 'Use lavender essential oil on your pillows; listen to soft pink noise.',
      affirmation: '"My breath is slow. My heart is calm. This panic is a wave that is passing."',
      ayurveda: 'Sip hot chamomile-Tulsi tea; rub warm sesame oil onto the soles of your feet.'
    },
    Overthinking: {
      yoga: 'Bhramari Pranayama (Humming Bee)',
      activity: 'Brain Dump: Write down every single thought onto scrap paper for 5 minutes, then shred it.',
      meditation: 'Body Scan: Place all awareness in the soles of your feet, then slowly move up to your crown.',
      sleep: 'Avoid all screens 2 hours before bed. Read a fiction book under dim yellow light.',
      affirmation: '"I step out of my mind and into the present. I trust the unfolding of my life."',
      ayurveda: 'Take 1 tsp of Brahmi juice or syrup with warm milk to cool brain friction.'
    },
    Sadness: {
      yoga: 'Surya Namaskar (Sun Salutation)',
      activity: 'Open the windows wide. Let sun rays touch your face for 10 minutes.',
      meditation: 'Metta (Loving-Kindness): Direct gentle thoughts: "May I be happy. May I be at peace."',
      sleep: 'Try light stretching before sleeping. Sleep facing east to welcome positive morning energy.',
      affirmation: '"I honor my feelings. I allow sadness to flow through me without defining who I am."',
      ayurveda: 'Drink warm water infused with ginger, Tulsi, and a slice of lemon to lift heavy Kapha energies.'
    },
    Anger: {
      yoga: 'Shavasana (Corpse Pose)',
      activity: 'Splash ice-cold water onto your face and chest 3 times.',
      meditation: 'Cooling Breath (Sheetali): Inhale through a rolled tongue, exhale through the nose.',
      sleep: 'Ensure your head points South or East while sleeping. Keep blankets light.',
      affirmation: '"I breathe in cooling peace. I exhale heat and irritation. I choose grace."',
      ayurveda: 'Apply a drop of cooling sandalwood paste to your forehead (third eye) and temples.'
    },
    'Low Motivation': {
      yoga: 'Surya Namaskar (Active flow)',
      activity: 'Put on high-energy music and shake your body vigorously for 2 minutes.',
      meditation: 'Breath of Fire (Kapalbhati): Active abdominal exhales to stimulate fire energy.',
      sleep: 'Wake up exactly at sunrise (Brahma Muhurta) to capture fresh solar energy.',
      affirmation: '"I am filled with infinite potential. My energy is flowing, vibrant, and alive."',
      ayurveda: 'Drink warm Tulsi tea with a pinch of black pepper and raw honey in the morning.'
    }
  };

  // Section 6: Breathing & Ambient Audio Controller (Web Audio Synthesizer)
  const [breathingPhase, setBreathingPhase] = useState('Inhale'); // Inhale, Hold, Exhale
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [activeSound, setActiveSound] = useState(null); // 'rain', 'forest', 'ocean', 'wind'
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.5);

  const audioCtxRef = useRef(null);
  const noiseSourceRef = useRef(null);
  const filterNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  const lfoRef = useRef(null);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Guided breathing cycle logic
  useEffect(() => {
    let interval = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev <= 1) {
            // Transition phase
            setBreathingPhase((currentPhase) => {
              if (currentPhase === 'Inhale') {
                return 'Hold';
              } else if (currentPhase === 'Hold') {
                return 'Exhale';
              } else {
                return 'Inhale';
              }
            });
            return 4; // Reset phase duration to 4 seconds
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
      setBreathingTimer(4);
      setBreathingPhase('Inhale');
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  // Audio synthesis engine using Web Audio API
  const stopAmbientAudio = () => {
    try {
      if (noiseSourceRef.current) {
        noiseSourceRef.current.stop();
        noiseSourceRef.current.disconnect();
        noiseSourceRef.current = null;
      }
      if (lfoRef.current) {
        lfoRef.current.stop();
        lfoRef.current.disconnect();
        lfoRef.current = null;
      }
      if (filterNodeRef.current) {
        filterNodeRef.current.disconnect();
        filterNodeRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
    } catch (e) {
      console.error('Error stopping synthesized audio:', e);
    }
  };

  const startAmbientAudio = (soundType) => {
    stopAmbientAudio();

    if (!soundType) return;

    try {
      // Init context
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;

      // Resume context if suspended (browser security)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Generate a 4-second buffer of white noise
      const bufferSize = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      // Noise source
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filter and Gain Nodes
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      // Set volume
      gain.gain.value = audioVolume;

      // Setup analyser for visualization
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      // Sound design synthesis based on type
      if (soundType === 'wind') {
        // Wind: Low-pass filtered noise with LFO modulating the filter frequency
        filter.type = 'bandpass';
        filter.frequency.value = 450;
        filter.Q.value = 3.0;

        // Slow LFO for wind gust swells
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 0.08; // very slow
        lfoGain.gain.value = 250; // modulate by 250Hz

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        lfoRef.current = lfo;

      } else if (soundType === 'ocean') {
        // Ocean: Heavy low-pass filter, slow LFO modulating gain to simulate waves crashing
        filter.type = 'lowpass';
        filter.frequency.value = 350;

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 0.07; // 14-second wave cycle
        lfoGain.gain.value = 0.35; // swell amount

        // Modulate main gain node directly
        lfo.connect(lfoGain);
        
        // Custom ocean wave gain controller
        const oceanGain = ctx.createGain();
        oceanGain.gain.value = 0.3; // base volume
        lfoGain.connect(oceanGain.gain);

        noise.connect(filter);
        filter.connect(oceanGain);
        oceanGain.connect(gain);
        
        lfo.start();
        lfoRef.current = lfo;

      } else if (soundType === 'rain') {
        // Rain: High-pass and band-pass filtering to get crisp high droplet sounds
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 1.0;

        // Add a secondary lowpass filter for depth
        const depthFilter = ctx.createBiquadFilter();
        depthFilter.type = 'lowpass';
        depthFilter.frequency.value = 2500;

        noise.connect(depthFilter);
        depthFilter.connect(filter);
        filter.connect(gain);

      } else if (soundType === 'forest') {
        // Forest: Wind base + periodic oscillator chirps to mimic crickets or birds
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        // Create secondary synth for cricket chirps
        const chirpInterval = setInterval(() => {
          if (!isAudioPlaying || activeSound !== 'forest') {
            clearInterval(chirpInterval);
            return;
          }
          playCricketChirp(ctx, gain);
        }, 3000);

        noise.connect(filter);
        filter.connect(gain);
      }

      // Connect nodes (unless ocean which had custom chain)
      if (soundType !== 'ocean') {
        noise.connect(filter);
        filter.connect(gain);
      }

      gain.connect(analyser);
      analyser.connect(ctx.destination);

      noise.start();

      noiseSourceRef.current = noise;
      filterNodeRef.current = filter;
      gainNodeRef.current = gain;

    } catch (e) {
      console.error('Failed to play synthesized sound:', e);
    }
  };

  // Helper to synthesize a cricket chirp (forest sound effect)
  const playCricketChirp = (ctx, destination) => {
    try {
      const time = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const chirpGain = ctx.createGain();
      const bandpass = ctx.createBiquadFilter();

      bandpass.type = 'bandpass';
      bandpass.frequency.value = 4200; // high frequency
      bandpass.Q.value = 10;

      osc1.type = 'sine';
      osc1.frequency.value = 4000;
      
      osc2.type = 'sawtooth';
      osc2.frequency.value = 80; // modulation frequency

      const modulatorGain = ctx.createGain();
      modulatorGain.gain.value = 500;

      osc2.connect(modulatorGain);
      modulatorGain.connect(osc1.frequency);

      chirpGain.gain.setValueAtTime(0, time);
      chirpGain.gain.linearRampToValueAtTime(0.01 * audioVolume, time + 0.05);
      chirpGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.4);

      osc1.connect(bandpass);
      bandpass.connect(chirpGain);
      chirpGain.connect(destination);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.45);
      osc2.stop(time + 0.45);
    } catch (err) {
      // Silently catch audio schedule failures
    }
  };

  // Manage playing/pausing state
  const handleSoundToggle = (sound) => {
    if (activeSound === sound) {
      if (isAudioPlaying) {
        setIsAudioPlaying(false);
        stopAmbientAudio();
      } else {
        setIsAudioPlaying(true);
        startAmbientAudio(sound);
      }
    } else {
      setActiveSound(sound);
      setIsAudioPlaying(true);
      startAmbientAudio(sound);
    }
  };

  // Update volume in real-time
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(audioVolume, audioCtxRef.current?.currentTime || 0);
    }
  }, [audioVolume]);

  // Clean up Web Audio on unmount
  useEffect(() => {
    return () => {
      stopAmbientAudio();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Audio visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement.clientWidth || 300;
    let height = canvas.height = 100;

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      
      ctx.clearRect(0, 0, width, height);

      const bufferLength = analyserRef.current ? analyserRef.current.frequencyBinCount : 32;
      const dataArray = new Uint8Array(bufferLength);
      
      if (analyserRef.current && isAudioPlaying) {
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        // Generate placeholder sine wave if no audio is playing
        const time = Date.now() * 0.004;
        for (let i = 0; i < bufferLength; i++) {
          let value = 0;
          if (isBreathingActive) {
            // Pulse visualizer based on breathing phase
            const multiplier = breathingPhase === 'Inhale' ? 1.5 : breathingPhase === 'Hold' ? 1.0 : 0.5;
            value = (Math.sin(i * 0.4 + time) + 1) * 15 * multiplier;
          } else {
            value = (Math.sin(i * 0.2 + time) + 1) * 5;
          }
          dataArray[i] = value;
        }
      }

      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Normalize value between 0 and height
        const val = dataArray[i];
        const percent = val / 255;
        const barHeight = Math.max(4, percent * height * 1.1);

        // Gradient based on breathing state
        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        
        if (breathingPhase === 'Inhale') {
          gradient.addColorStop(0, '#60a5fa'); // blue-400
          gradient.addColorStop(1, '#a78bfa'); // purple-400
        } else if (breathingPhase === 'Hold') {
          gradient.addColorStop(0, '#f472b6'); // pink-400
          gradient.addColorStop(1, '#34d399'); // emerald-400
        } else {
          gradient.addColorStop(0, '#34d399'); // emerald-400
          gradient.addColorStop(1, '#60a5fa'); // blue-400
        }

        ctx.fillStyle = gradient;
        
        // Draw rounded capsule bars
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, 4);
        } else {
          ctx.rect(x, height - barHeight, barWidth - 2, barHeight);
        }
        ctx.fill();

        x += barWidth;
      }
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAudioPlaying, isBreathingActive, breathingPhase]);

  // Section 7: Quick Calm Support Panel
  const [quickCalmOpen, setQuickCalmOpen] = useState(false);
  const [activeCalmTab, setActiveCalmTab] = useState(null); // 'anxious', 'sleep', 'thoughts', 'relax'

  const calmSupportData = {
    anxious: {
      title: 'Grounding Exercises (5-4-3-2-1 Technique)',
      subtitle: 'Bring your mind back to the physical world. Look around your room and list out:',
      steps: [
        '👁️ 5 Things you can see (a chair, light, pen, painting, window)',
        '🖐️ 4 Things you can feel (fabric of clothes, cool desk, hair, feet on floor)',
        '👂 3 Things you can hear (fan humming, traffic outside, clock tick)',
        '👃 2 Things you can smell (coffee scent, soap, fresh air, books)',
        '👅 1 Thing you can taste (lingering food taste, water, fresh mint)'
      ],
      affirmation: '"I am safe. I am present in this room. My chest is opening, and I can breathe freely."'
    },
    sleep: {
      title: 'Restful Sleep Prep (4-7-8 Breathing)',
      subtitle: 'Perform this breathing sequence to trigger the parasympathetic nervous system:',
      steps: [
        '💨 Exhale completely through your mouth, making a whoosh sound.',
        '👃 Close your mouth and inhale quietly through your nose for 4 seconds.',
        '🧘 Hold your breath for a count of 7 seconds.',
        '💨 Exhale completely through your mouth, making a whoosh sound for 8 seconds.',
        '🔁 Repeat this cycle 4 times to drop your heart rate.'
      ],
      affirmation: '"My day is done. I surrender all thoughts. My body is heavy, relaxed, and ready for deep rest."'
    },
    thoughts: {
      title: 'Calming Overactive Thoughts',
      subtitle: 'Break the cycle of feedback loops with these steps:',
      steps: [
        '✍️ Grab a piece of paper and write down every single anxiety without grammar or filter.',
        '🧘 Close your eyes and visualize these thoughts as letters written on sand, slowly washed away by ocean waves.',
        '❄️ Wash your face with ice-cold water. This activates the mammalian dive reflex to instantly calm your brain.',
        '🚶 Stand up and stretch your arms high, exhaling with a sigh.'
      ],
      affirmation: '"I am the sky; my thoughts are just passing storm clouds. I do not have to believe every worry I think."'
    },
    relax: {
      title: 'Deep Physical Relaxation (Somatic Release)',
      subtitle: 'Release stored physical energy with progressive muscle relaxation:',
      steps: [
        '✊ Curl your toes and squeeze them tightly for 5 seconds, then release completely. Feel the relaxation.',
        '🦵 Tense your calf and thigh muscles, hold for 5 seconds, then let go.',
        '🍑 Clench your abdomen and glutes, hold, then release.',
        '💪 Clench your fists and shrug your shoulders up to your ears, hold, then drop them heavily.',
        '🥴 Squeeze your face muscles tightly, hold, and release. Rest your tongue away from the roof of your mouth.'
      ],
      affirmation: '"I release tension from my neck, my chest, and my jaw. I allow my muscles to sink deep into safety."'
    }
  };

  const handleQuickCalmClick = (tab) => {
    setActiveCalmTab(tab);
    setQuickCalmOpen(true);
  };

  // Quotes Slider
  const quotes = [
    '"Within you, there is a stillness and a sanctuary to which you can retreat at any time and be yourself." — Hermann Hesse',
    '"Heal your mind, and your body will follow. Balance is not something you find, it is something you create." — Ayurvedic Wisdom',
    '"The root of all health is in the brain. The trunk of it is in the emotion. The branches and leaves are the body." — Ancient Proverb',
    '"Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor." — Thich Nhat Hanh',
    '"Quiet the mind and the soul will speak." — Ma Jaya Sati Bhagavati'
  ];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden relative pt-4">
      
      {/* Floating Animated Gradient Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[130px] mix-blend-multiply opacity-60 animate-float" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-100/35 rounded-full blur-[130px] mix-blend-multiply opacity-60 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-emerald-100/30 rounded-full blur-[130px] mix-blend-multiply opacity-60 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10">
        
        {/* Navigation back Button */}
        <Container className="pt-2">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-all rounded-xl"
          >
            <ArrowLeft size={18} /> Back to Home
          </Button>
        </Container>

        {/* ==================== SECTION 1: HERO WELLNESS BANNER ==================== */}
        <Container className="pt-4 pb-12 md:pt-6 md:pb-16">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-7 space-y-6 text-center md:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold backdrop-blur-sm shadow-sm">
                <Sparkles size={14} className="animate-spin-slow" /> Premium Healing Module
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight">
                Heal Your Mind<br />
                <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent bg-200% animate-gradient">
                  Naturally
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                Discover yoga, ayurvedic wisdom, and mindful routines designed to restore emotional balance, calm anxious thoughts, and cultivate inner peace.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <Button 
                  onClick={() => scrollToSection(yogaSectionRef)} 
                  className="rounded-full px-8 py-5 text-base bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25"
                >
                  Explore Yoga <ChevronRight size={16} />
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => scrollToSection(ayurvedaSectionRef)} 
                  className="rounded-full px-8 py-5 text-base hover:border-emerald-500 hover:text-emerald-600"
                >
                  Wellness Guide
                </Button>
              </div>
            </motion.div>

            {/* Hero Right: Pulsing Mandala Breathing Circle */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-5 flex justify-center"
            >
              <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Outer concentric pulsing rings */}
                <div className="absolute inset-0 rounded-full border border-emerald-200/40 bg-emerald-100/5 animate-ping" style={{ animationDuration: '4s' }} />
                <div className="absolute inset-8 rounded-full border border-teal-200/40 bg-teal-100/5 animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-16 rounded-full border border-indigo-200/30 bg-indigo-100/5 animate-pulse" style={{ animationDuration: '5s' }} />
                
                {/* Central Meditating Lotus SVG */}
                <div className="w-52 h-52 bg-white/70 backdrop-blur-md rounded-full shadow-xl border border-white/50 flex items-center justify-center relative z-10">
                  <svg viewBox="0 0 100 100" className="w-36 h-36 text-emerald-500 fill-none stroke-current" strokeWidth="1.5">
                    {/* Lotus petals */}
                    <path d="M50,15 C45,30 30,45 50,85 C70,45 55,30 50,15 Z" fill="rgba(16, 185, 129, 0.05)" />
                    <path d="M50,35 C35,45 20,60 50,85 C80,60 65,45 50,35 Z" fill="rgba(16, 185, 129, 0.03)" opacity="0.8" />
                    <path d="M50,55 C42,60 25,75 50,85 C75,75 58,60 50,55 Z" fill="rgba(16, 185, 129, 0.02)" opacity="0.6" />
                    
                    {/* Figure */}
                    <circle cx="50" cy="40" r="6" fill="currentColor" />
                    <path d="M50,46 Q40,55 35,70 Q50,75 65,70 Q60,55 50,46 Z" fill="currentColor" opacity="0.2" strokeWidth="2" />
                    <path d="M38,70 Q50,80 62,70" strokeWidth="2.5" />
                    
                    {/* Heart Center Sparkle */}
                    <circle cx="50" cy="53" r="2" fill="#3b82f6" className="animate-ping" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>

        {/* Wellness Quotes Slider */}
        <Container className="mb-16">
          <div className="max-w-4xl mx-auto px-6 py-5 bg-white/40 border border-white/60 backdrop-blur-md rounded-2xl shadow-sm text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-slate-600 font-medium italic text-sm md:text-base leading-relaxed"
              >
                {quotes[currentQuoteIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </Container>

        {/* ==================== SECTION 2: YOGA FOR MENTAL WELLNESS ==================== */}
        <section ref={yogaSectionRef} className="py-10 md:py-14 relative bg-gradient-to-b from-white/10 to-emerald-50/20">
          <Container>
            
            {/* Section Header */}
            <div className="text-center md:text-left mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
                <Wind size={14} strokeWidth={2.5} /> Mindful Asanas
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Yoga for Mental Wellness</h2>
              <p className="text-slate-600 max-w-2xl text-base md:text-lg">
                Explore specialized postures and pranayamas designed to adjust nervous system tone, calm overthinking, and lift low mood.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
              {yogaFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveYogaFilter(filter)}
                  className={`px-5 py-2 text-xs font-bold rounded-full transition-all border ${
                    activeYogaFilter === filter
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Horizontal Scrollable Yoga List */}
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory no-scrollbar">
                {filteredYogaPoses.map((pose) => (
                  <motion.div
                    key={pose.id}
                    layout
                    whileHover={{ y: -6 }}
                    className="min-w-[280px] sm:min-w-[320px] md:min-w-[350px] snap-start"
                  >
                    <Card className="h-full flex flex-col justify-between hover:shadow-xl hover:border-purple-200/50 transition-all duration-300 p-6 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-100">
                      <div>
                        {/* Illustration wrapper */}
                        <div className={`aspect-video rounded-2xl bg-gradient-to-br ${pose.color} bg-opacity-10 flex items-center justify-center mb-5 p-4 overflow-hidden relative group`}>
                          <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="transform group-hover:scale-110 transition-transform duration-500">
                            {pose.svg}
                          </div>
                        </div>

                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{pose.name}</h3>
                            <p className="text-xs text-slate-400 font-semibold italic">{pose.sanskrit}</p>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                            {pose.category}
                          </span>
                        </div>

                        <p className="text-sm font-medium text-slate-500 mt-2 mb-4 leading-relaxed">
                          {pose.benefit}
                        </p>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100/60">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {pose.duration}
                          </span>
                          <span>Level: {pose.difficulty}</span>
                        </div>
                        <Button
                          onClick={() => setSelectedYoga(pose)}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white transition-all text-xs py-3.5 rounded-xl justify-center font-bold"
                        >
                          Watch Routine
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

          </Container>
        </section>

        {/* ==================== SECTION 3: AYURVEDIC WELLNESS HUB ==================== */}
        <section ref={ayurvedaSectionRef} className="py-10 md:py-14 bg-gradient-to-b from-emerald-50/20 to-white/10 relative">
          <Container>
            
            {/* Header */}
            <div className="text-center md:text-left mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-3">
                <BookOpen size={14} /> Herbal Wisdom
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Ayurvedic Wellness Hub</h2>
              <p className="text-slate-600 max-w-2xl text-base md:text-lg">
                Discover nature's finest herbs and supplements that nourish the nervous system, reduce cortisol, and combat chronic emotional fatigue.
              </p>
            </div>

            {/* Herb Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {herbs.map((herb) => {
                const HerbIcon = herb.icon;
                return (
                  <motion.div
                    key={herb.id}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="h-full"
                  >
                    <Card
                      onClick={() => setSelectedHerb(herb)}
                      className="h-full flex flex-col justify-between items-center text-center p-6 bg-white/70 backdrop-blur-md rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-50/60 rounded-full group-hover:bg-emerald-100/60 transition-colors duration-300">
                          <HerbIcon />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">{herb.name}</h3>
                          <p className="text-[10px] text-slate-400 font-semibold italic mt-0.5">{herb.scientific}</p>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                          {herb.benefits}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center gap-1 text-[11px] font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                        Explore Details <ChevronRight size={14} />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Disclaimer Box */}
            <div className="mt-12 max-w-3xl mx-auto p-4 bg-amber-50/70 border border-amber-200/50 backdrop-blur-sm rounded-2xl flex gap-3 items-start">
              <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                <span className="font-bold">Ayurvedic Disclaimer:</span> Consult certified healthcare professionals before using any Ayurvedic remedies or supplements. These suggestions are educational and are not meant to substitute professional medical diagnosis, advice, or treatment.
              </p>
            </div>

          </Container>
        </section>

        {/* ==================== SECTION 4: DAILY HEALING ROUTINE ==================== */}
        <section ref={timelineSectionRef} className="py-10 md:py-14 relative bg-gradient-to-b from-white/10 to-slate-50/50">
          <Container>
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
                <Activity size={14} /> Circadian Flow
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Daily Healing Routine</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg">
                Track your alignment with natural circadian cycles. Complete each step to build neural resilience and calm your mind.
              </p>
              
              {/* Progress Gauge */}
              <div className="mt-4 flex flex-col items-center max-w-xs mx-auto">
                <div className="flex justify-between w-full text-xs font-bold text-slate-500 mb-2">
                  <span>Day Completion</span>
                  <span className="text-blue-600">{progressPercentage}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40 p-0.5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Vertical Timeline */}
            <div className="max-w-3xl mx-auto relative pl-6 sm:pl-0">
              
              {/* Vertical line connecting nodes */}
              <div className="absolute left-3 sm:left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 rounded-full overflow-hidden">
                <motion.div
                  className="w-full bg-gradient-to-b from-blue-500 to-indigo-500 origin-top"
                  initial={{ height: 0 }}
                  animate={{ height: `${progressPercentage}%` }}
                  style={{ transition: 'height 0.3s ease-out' }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-12">
                {routineSteps.map((step, idx) => {
                  const isLeft = idx % 2 === 0;
                  const isCompleted = completedRoutineSteps[step.id];
                  
                  return (
                    <div 
                      key={step.id} 
                      className={`flex flex-col sm:flex-row items-start sm:items-center relative ${
                        isLeft ? 'sm:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Timeline Central Node */}
                      <div 
                        onClick={() => toggleRoutineStep(step.id)}
                        className={`absolute left-0 sm:left-1/2 w-6 h-6 rounded-full border-4 cursor-pointer z-20 -translate-x-1/2 transition-all duration-300 flex items-center justify-center ${
                          isCompleted
                            ? 'bg-blue-500 border-blue-200 scale-110 shadow-lg shadow-blue-500/30'
                            : 'bg-white border-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {isCompleted && <CheckCircle size={10} className="text-white fill-current" />}
                      </div>

                      {/* Content Card */}
                      <div className={`w-full sm:w-[45%] ml-6 sm:ml-0 ${isLeft ? 'sm:text-right sm:pr-8' : 'sm:pl-8'}`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          onClick={() => toggleRoutineStep(step.id)}
                          className={`p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                            isCompleted ? 'bg-blue-50/10 border-blue-200/40' : ''
                          }`}
                        >
                          <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'sm:justify-end' : ''}`}>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                              {step.time}
                            </span>
                            {isCompleted && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                Completed
                              </span>
                            )}
                          </div>
                          
                          <h3 className={`text-lg font-bold transition-colors ${
                            isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
                          }`}>
                            {step.title}
                          </h3>
                          <p className={`text-xs mt-1.5 leading-relaxed ${
                            isCompleted ? 'text-slate-400 line-through' : 'text-slate-500'
                          }`}>
                            {step.desc}
                          </p>
                        </motion.div>
                      </div>

                      {/* Empty spacer for grid alignment */}
                      <div className="hidden sm:block sm:w-[45%]" />
                    </div>
                  );
                })}
              </div>

            </div>

          </Container>
        </section>

        {/* ==================== SECTION 5: MOOD-BASED AI SUGGESTIONS ==================== */}
        <section ref={moodSectionRef} className="py-10 md:py-14 relative bg-gradient-to-b from-[#FDFCFB] to-slate-100/40">
          <Container>
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold mb-3">
                <Brain size={14} /> AI Recommendation Engine
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Mood-Based Suggestions</h2>
              <p className="text-slate-600 text-base md:text-lg">
                Tell us how you are feeling, and our smart recommendation engine will customize a tailored natural routine to restore your balance.
              </p>
            </div>

            {/* Mood selector buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-6 max-w-4xl mx-auto">
              {Object.keys(moodRecommendations).map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
                  className={`px-6 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 text-sm md:text-base border shadow-sm ${
                    selectedMood === mood
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xl shadow-purple-600/20 -translate-y-1.5'
                      : 'bg-white text-slate-700 border-slate-100 hover:border-purple-200 hover:shadow-md'
                  }`}
                >
                  <Smile size={18} />
                  {mood}
                </button>
              ))}
            </div>

            {/* Suggestions Dashboard */}
            <AnimatePresence mode="wait">
              {selectedMood ? (
                <motion.div
                  key={selectedMood}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_-20px_rgba(124,58,237,0.1)] relative overflow-hidden">
                    
                    {/* Glowing corner indicator */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-[100px] blur-xl" />

                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tailored Routine For</span>
                        <h3 className="text-2xl font-bold text-slate-900">{selectedMood} State</h3>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      
                      {/* Left Column */}
                      <div className="space-y-6">
                        
                        <div>
                          <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            🧘 Recommended Yoga Pose
                          </h4>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="font-bold text-slate-800 text-sm">{moodRecommendations[selectedMood].yoga}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            ⚡ Grounding Activity
                          </h4>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-slate-600 text-sm leading-relaxed">{moodRecommendations[selectedMood].activity}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            🌿 Ayurvedic Suggestion
                          </h4>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-slate-600 text-sm leading-relaxed">{moodRecommendations[selectedMood].ayurveda}</p>
                          </div>
                        </div>

                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        
                        <div>
                          <h4 className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            🧠 Mind & Meditation Tip
                          </h4>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-slate-600 text-sm leading-relaxed">{moodRecommendations[selectedMood].meditation}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            💤 Sleep Improvement Advice
                          </h4>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-slate-600 text-sm leading-relaxed">{moodRecommendations[selectedMood].sleep}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            💖 Daily Affirmation
                          </h4>
                          <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-100/50">
                            <p className="text-slate-800 text-sm italic font-medium leading-relaxed">
                              {moodRecommendations[selectedMood].affirmation}
                            </p>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                </motion.div>
              ) : (
                <div className="text-center p-12 bg-white/40 border border-white/60 border-dashed rounded-3xl max-w-xl mx-auto">
                  <Info className="mx-auto text-slate-400 mb-3" size={24} />
                  <p className="text-slate-500 font-semibold">Select your current mood state above to unlock personalized natural therapy recommendations.</p>
                </div>
              )}
            </AnimatePresence>

          </Container>
        </section>

        {/* ==================== SECTION 6: BREATHING & CALMING EXPERIENCE ==================== */}
        <section className="py-10 md:py-14 bg-slate-950 text-slate-200 relative overflow-hidden">
          
          {/* Subtle cosmic elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-12 left-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

          <Container className="relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Ambient audio select & controls */}
              <div className="lg:col-span-6 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-900 text-indigo-300 text-xs font-semibold mb-4">
                    <Compass size={14} /> Immersive Space
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Relaxing Sounds & Breathing</h2>
                  <p className="text-slate-400 text-base">
                    Block out external chaos. Select a background ambient synthesizer sound, control your volume, and sync your breath with the visual guide.
                  </p>
                </div>

                {/* Sound Selectors */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Nature Ambience</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { id: 'rain', name: 'Rain', icon: '🌧️', desc: 'Synthesized patter' },
                      { id: 'ocean', name: 'Ocean Waves', icon: '🌊', desc: 'Slow tide swells' },
                      { id: 'forest', name: 'Forest', icon: '🌲', desc: 'Birds & breeze' },
                      { id: 'wind', name: 'Wind', icon: '🍃', desc: 'Mountain gust' }
                    ].map((sound) => (
                      <button
                        key={sound.id}
                        onClick={() => handleSoundToggle(sound.id)}
                        className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                          activeSound === sound.id && isAudioPlaying
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-lg text-white scale-105'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-2xl">{sound.icon}</span>
                        <span className="text-xs font-bold">{sound.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio Master Controls */}
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row gap-6 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (activeSound) {
                          setIsAudioPlaying(!isAudioPlaying);
                          if (!isAudioPlaying) {
                            startAmbientAudio(activeSound);
                          } else {
                            stopAmbientAudio();
                          }
                        }
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isAudioPlaying
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 hover:scale-105'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {isAudioPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {isAudioPlaying ? `Playing Synthesized ${activeSound}` : 'Synth Audio Stopped'}
                      </h4>
                      <p className="text-[11px] text-slate-400">Zero-external-dependency Web Audio synth</p>
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => setAudioVolume(prev => prev === 0 ? 0.5 : 0)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {audioVolume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={audioVolume}
                      onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                      className="w-28 accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Canvas Visualizer */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Audio Waves / Breathing Pulses</h4>
                  <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 h-28 flex items-center justify-center">
                    <canvas ref={canvasRef} className="w-full h-full" />
                  </div>
                </div>
              </div>

              {/* Right Column: Guided breathing circle animation */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <div className="relative w-80 h-80 flex items-center justify-center">
                  
                  {/* Concentric pulsing circles keyed to phase */}
                  <AnimatePresence>
                    <motion.div
                      key={breathingPhase + isBreathingActive}
                      className={`absolute rounded-full border opacity-15 pointer-events-none ${
                        breathingPhase === 'Inhale' 
                          ? 'bg-blue-500 border-blue-400' 
                          : breathingPhase === 'Hold' 
                            ? 'bg-pink-500 border-pink-400' 
                            : 'bg-emerald-500 border-emerald-400'
                      }`}
                      style={{ inset: 0 }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={isBreathingActive ? {
                        scale: breathingPhase === 'Inhale' ? [0.9, 1.25] : breathingPhase === 'Hold' ? [1.25, 1.25] : [1.25, 0.9],
                        opacity: [0.15, 0.25, 0.15]
                      } : { scale: 1, opacity: 0.1 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </AnimatePresence>

                  <div className="absolute inset-8 rounded-full border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center text-center p-6 z-10">
                    <Wind size={36} className={`mb-3 transition-colors ${
                      breathingPhase === 'Inhale' 
                        ? 'text-blue-400' 
                        : breathingPhase === 'Hold' 
                          ? 'text-pink-400' 
                          : 'text-emerald-400'
                    }`} />
                    
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                      {isBreathingActive ? 'Box Breathing' : 'Guided Resettling'}
                    </h3>
                    
                    <span className="text-3xl font-extrabold text-white tracking-wider block h-10">
                      {isBreathingActive ? breathingPhase : 'Ready'}
                    </span>
                    
                    <span className="text-4xl font-black text-slate-100 mt-2 block font-mono h-12">
                      {isBreathingActive ? `${breathingTimer}s` : '--'}
                    </span>

                    {/* Timer instructions indicator */}
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">
                      {breathingPhase === 'Inhale' && 'Slowly take deep belly breath'}
                      {breathingPhase === 'Hold' && 'Retain air and relax your mind'}
                      {breathingPhase === 'Exhale' && 'Exhale all worries with a whoosh'}
                    </p>
                  </div>

                </div>

                <div className="mt-8 flex gap-4">
                  <Button
                    onClick={() => setIsBreathingActive(!isBreathingActive)}
                    className={`rounded-full px-8 py-4 text-xs font-bold tracking-wider uppercase transition-all ${
                      isBreathingActive
                        ? 'bg-red-600 text-white hover:bg-red-500'
                        : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    }`}
                  >
                    {isBreathingActive ? 'Stop Session' : 'Start Breathing'}
                  </Button>
                </div>
              </div>

            </div>
          </Container>
        </section>

        {/* ==================== SECTION 7: QUICK CALM SUPPORT PANEL (PAGE ACCESSIBLE) ==================== */}
        <section className="py-10 md:py-14 relative bg-gradient-to-b from-slate-50/50 to-[#FDFCFB]">
          <Container>
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold mb-3">
                <HelpCircle size={14} /> Emergency Grounding
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Quick Calm Support Panel</h2>
              <p className="text-slate-600 text-base">
                If you are currently experiencing high stress, overthinking, or sleep troubles, click one of the quick support panels below for instant comfort.
              </p>
            </div>

            {/* Quick buttons */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { id: 'anxious', title: 'I feel anxious', bg: 'hover:border-blue-300 hover:shadow-blue-500/10' },
                { id: 'relax', title: 'Help me relax', bg: 'hover:border-purple-300 hover:shadow-purple-500/10' },
                { id: 'thoughts', title: 'Calm my thoughts', bg: 'hover:border-amber-300 hover:shadow-amber-500/10' },
                { id: 'sleep', title: 'Help me sleep', bg: 'hover:border-emerald-300 hover:shadow-emerald-500/10' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => handleQuickCalmClick(btn.id)}
                  className={`p-6 rounded-3xl border bg-white shadow-sm flex flex-col justify-between text-left transition-all duration-300 group hover:-translate-y-1 ${btn.bg}`}
                >
                  <span className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {btn.id === 'anxious' && '🌀'}
                    {btn.id === 'relax' && '💆'}
                    {btn.id === 'thoughts' && '🤯'}
                    {btn.id === 'sleep' && '🛌'}
                  </span>
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold text-slate-800 text-base md:text-lg">{btn.title}</span>
                    <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>

          </Container>
        </section>

      </div>

      {/* ==================== STICKY FLOATING QUICK CALM Support WIDGET ==================== */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveCalmTab('anxious');
            setQuickCalmOpen(true);
          }}
          className="h-14 px-6 rounded-full bg-rose-600 text-white font-bold flex items-center gap-2 shadow-2xl hover:bg-rose-500 transition-all border border-rose-500/20 shadow-rose-600/30"
        >
          <Flame className="animate-pulse" size={20} />
          <span>🚨 Instant Calm</span>
        </motion.button>
      </div>

      {/* ==================== MODAL WINDOW: YOGA watch routine ==================== */}
      <AnimatePresence>
        {selectedYoga && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedYoga(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative z-10 border border-slate-100 overflow-y-auto max-h-[85vh] no-scrollbar"
            >
              <button 
                onClick={() => setSelectedYoga(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Wind size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Yoga Routine Guide</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">{selectedYoga.name}</h3>
              <p className="text-xs text-slate-400 font-bold italic mb-6">Sanskrit: {selectedYoga.sanskrit}</p>

              {/* Graphic Illustration */}
              <div className="w-full py-8 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200/40 mb-6">
                <div className="scale-125">{selectedYoga.svg}</div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b pb-2">Step-by-Step Instructions:</h4>
                <ol className="space-y-3.5 pl-5 list-decimal text-slate-600 text-sm leading-relaxed font-medium">
                  {selectedYoga.steps.map((step, idx) => (
                    <li key={idx} className="pl-1">{step}</li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-4 mt-8 pt-4 border-t border-slate-100">
                <Button 
                  onClick={() => {
                    setSelectedYoga(null);
                    scrollToSection(yogaSectionRef);
                  }}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-4 font-bold text-xs"
                >
                  Close & Start Practice
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL WINDOW: HERB explorer ==================== */}
      <AnimatePresence>
        {selectedHerb && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHerb(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] max-w-2xl w-full p-6 md:p-10 shadow-2xl relative z-10 border-2 border-emerald-100 overflow-y-auto max-h-[85vh] no-scrollbar"
            >
              <button 
                onClick={() => setSelectedHerb(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center pb-6 border-b border-slate-100">
                <div className="p-4 bg-emerald-50 rounded-full inline-block mb-3">
                  {React.createElement(selectedHerb.icon)}
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900">{selectedHerb.name}</h3>
                <p className="text-xs text-slate-400 font-bold italic mt-0.5">{selectedHerb.scientific}</p>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-2">{selectedHerb.tagline}</p>
              </div>

              <div className="space-y-6 py-6 overflow-y-auto max-h-[40vh] pr-2 scrollbar-thin">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Description</h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">{selectedHerb.desc}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Mental Health Benefits</h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">{selectedHerb.benefits}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Usage Protocol</h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedHerb.usage}
                  </p>
                </div>

                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                  <h4 className="text-xs font-bold text-red-700 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    ⚠️ Herb Precautions
                  </h4>
                  <p className="text-red-700 text-xs font-semibold leading-relaxed">
                    {selectedHerb.precautions}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 font-medium mb-4 italic">
                  *Consult a medical practitioner before introducing botanical supplements.
                </p>
                <Button 
                  onClick={() => setSelectedHerb(null)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-4 font-bold text-xs"
                >
                  Acknowledged & Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL WINDOW: QUICK CALM WIDGET PANEL ==================== */}
      <AnimatePresence>
        {quickCalmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setQuickCalmOpen(false);
                setActiveCalmTab(null);
              }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-[2rem] max-w-2xl w-full p-6 md:p-8 shadow-2xl relative z-10 border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => {
                  setQuickCalmOpen(false);
                  setActiveCalmTab(null);
                }}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 text-rose-600 mb-6">
                <Flame className="animate-pulse" size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Instant Grounding Panel</span>
              </div>

              {/* Sub tabs inside modal */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100">
                {[
                  { id: 'anxious', label: '🌀 Anxiety' },
                  { id: 'relax', label: '💆 Tension' },
                  { id: 'thoughts', label: '🤯 Thoughts' },
                  { id: 'sleep', label: '🛌 Insomnia' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCalmTab(tab.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                      activeCalmTab === tab.id
                        ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeCalmTab && calmSupportData[activeCalmTab] ? (
                <div className="space-y-6 overflow-y-auto flex-1 pr-2 no-scrollbar">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {calmSupportData[activeCalmTab].title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">
                      {calmSupportData[activeCalmTab].subtitle}
                    </p>
                  </div>

                  <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    {calmSupportData[activeCalmTab].steps.map((step, idx) => (
                      <div key={idx} className="text-slate-700 text-sm font-semibold leading-relaxed">
                        {step}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block mb-1">Calming Affirmation</span>
                    <p className="text-slate-800 text-sm italic font-medium leading-relaxed">
                      {calmSupportData[activeCalmTab].affirmation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
                  <Info className="text-slate-400 mb-2" size={24} />
                  <p className="text-slate-500 font-bold">Please select an issue tab above to load instant exercises.</p>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 flex gap-4 mt-6">
                <Button 
                  onClick={() => {
                    setQuickCalmOpen(false);
                    setActiveCalmTab(null);
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-4 font-bold text-xs"
                >
                  I Feel A Bit Calmer
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HealingWellness;
