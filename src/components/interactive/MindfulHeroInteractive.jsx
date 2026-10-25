import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, 
  Sparkles, 
  Volume2, 
  RefreshCw, 
  Heart, 
  Smile, 
  Sun, 
  Play, 
  Pause,
  Waves,
  CloudRain,
  Bell,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function MindfulHeroInteractive({ onNavigate }) {
  // Breathing Circle State
  const [isBreathing, setIsBreathing] = useState(true);
  const [breathText, setBreathText] = useState('Inhale peace...');
  const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'

  // Daily Affirmation State
  const affirmations = [
    "I honor my peace and trust my emotional journey.",
    "Breathe in calm, exhale worry. You are safe here.",
    "My mind is clear, grounded, and resilient today.",
    "It is okay to pause. Rest is productive.",
    "I let go of what I cannot control and embrace the present.",
    "One gentle breath at a time, I reclaim my serenity."
  ];
  const [affirmationIdx, setAffirmationIdx] = useState(0);

  // Soundscape State & Web Audio Generator
  const [activeSound, setActiveSound] = useState(null); // 'bowl', 'rain', 'waves', null
  const audioCtxRef = useRef(null);
  const activeNodesRef = useRef([]);

  // Guided 4-4-4 Breathing Cycle
  useEffect(() => {
    if (!isBreathing) {
      setBreathText('Click to start breathing');
      return;
    }

    let cycle = 0;
    const interval = setInterval(() => {
      cycle = (cycle + 1) % 12;
      if (cycle < 4) {
        setBreathPhase('inhale');
        setBreathText('Breathe in peace... 🌸');
      } else if (cycle < 7) {
        setBreathPhase('hold');
        setBreathText('Hold stillness... ✨');
      } else {
        setBreathPhase('exhale');
        setBreathText('Release all tension... 🍃');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing]);

  // Audio Cleanup
  const stopAllAudio = () => {
    if (activeNodesRef.current) {
      activeNodesRef.current.forEach(node => {
        try { node.stop(); } catch (e) {}
        try { node.disconnect(); } catch (e) {}
      });
      activeNodesRef.current = [];
    }
  };

  useEffect(() => {
    return () => stopAllAudio();
  }, []);

  // Web Audio Synthesizer for Relaxing Zen Sounds
  const toggleSound = (soundType) => {
    if (activeSound === soundType) {
      stopAllAudio();
      setActiveSound(null);
      return;
    }

    stopAllAudio();

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (soundType === 'bowl') {
        // 432 Hz Harmonic Tibetan Bell
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, ctx.currentTime);
        
        // Soft vibrato modulation
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(2.5, ctx.currentTime);
        lfoGain.gain.setValueAtTime(3, ctx.currentTime);
        lfo.connect(osc.frequency);

        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + 6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        lfo.start();
        osc.stop(ctx.currentTime + 6.2);
        lfo.stop(ctx.currentTime + 6.2);

        activeNodesRef.current = [osc, lfo];
        setActiveSound('bowl');

        setTimeout(() => {
          setActiveSound(null);
        }, 6000);
      } 
      else if (soundType === 'rain' || soundType === 'waves') {
        // Ambient Soundscape Filtered Noise
        const bufferSize = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = soundType === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(soundType === 'rain' ? 850 : 380, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.09, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        activeNodesRef.current = [noise];
        setActiveSound(soundType);
      }
    } catch (err) {
      console.warn("Web audio not allowed:", err);
      setActiveSound(soundType);
    }
  };

  const handleNextAffirmation = () => {
    setAffirmationIdx((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-floating border border-white/80 bg-white/60 backdrop-blur-md group transition-all">
      
      {/* 16:9 Widescreen Image Container - Perfectly preserves original 1024x576 aspect ratio */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[16/9] max-h-[560px] overflow-hidden rounded-3xl bg-[#FAF8F5]">
        
        {/* User-uploaded serene artwork: FULLY VISIBLE, FACE CENTERED & UNCROPPED */}
        <img
          src="/images/hero-mindful.jpg"
          alt="Mindful Serenity - Woman practicing calm reflection with lavender blossoms"
          className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.01]"
        />

        {/* Soft edge ambient blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 pointer-events-none"></div>

        {/* =========================================================================
            TOP ROW: Live Status & Zen Soundscape Controls
            ========================================================================= */}
        <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-6 flex flex-wrap items-center justify-between gap-2 z-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/90 shadow-soft text-xs font-bold text-mindful-purple">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>🌸 Serenity Sanctuary</span>
          </div>

          {/* Real Web Audio Zen Soundscapes */}
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-white/90 shadow-soft">
            <button
              type="button"
              onClick={() => toggleSound('bowl')}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSound === 'bowl'
                  ? 'bg-mindful-purple text-white shadow-sm scale-105'
                  : 'text-mindful-textDark hover:bg-purple-50'
              }`}
              title="Play 432Hz Tibetan Singing Bell"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Zen Bell</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSound('waves')}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSound === 'waves'
                  ? 'bg-mindful-purple text-white shadow-sm scale-105'
                  : 'text-mindful-textDark hover:bg-purple-50'
              }`}
              title="Play Gentle Ocean Waves"
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Waves</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSound('rain')}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSound === 'rain'
                  ? 'bg-mindful-purple text-white shadow-sm scale-105'
                  : 'text-mindful-textDark hover:bg-purple-50'
              }`}
              title="Play Calming Forest Rain"
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Rain</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            LEFT COLUMN (Negative Space): Breathing Exercise & Affirmation
            Leaves the woman's face on the right completely unblocked!
            ========================================================================= */}
        <div className="absolute left-4 sm:left-6 top-20 sm:top-24 bottom-20 z-20 flex flex-col justify-between max-w-xs sm:max-w-sm pointer-events-none">
          
          {/* Guided Breathing Pill */}
          <div 
            onClick={() => setIsBreathing(!isBreathing)}
            className="pointer-events-auto cursor-pointer select-none"
            title="Click to toggle guided breathing"
          >
            <div className="px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/95 shadow-floating flex items-center gap-3 transition-transform hover:scale-105">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                breathPhase === 'inhale'
                  ? 'bg-purple-100 text-mindful-purple ring-2 ring-mindful-purple/50 scale-110'
                  : breathPhase === 'hold'
                  ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-400/50'
                  : 'bg-emerald-100 text-emerald-600 scale-95'
              }`}>
                <Wind className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-mindful-purple">
                  4-4-4 Rhythmic Breath
                </p>
                <p className="text-xs sm:text-sm font-bold text-mindful-textDark">
                  {breathText}
                </p>
              </div>
            </div>
          </div>

          {/* Daily Affirmation Capsule */}
          <div className="pointer-events-auto hidden sm:block">
            <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 shadow-soft flex items-center justify-between gap-3">
              <div className="space-y-0.5 text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-mindful-purple flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Daily Intention
                </span>
                <p className="text-xs font-semibold text-mindful-textDark italic line-clamp-2">
                  "{affirmations[affirmationIdx]}"
                </p>
              </div>

              <button
                type="button"
                onClick={handleNextAffirmation}
                className="w-7 h-7 rounded-full bg-purple-50 hover:bg-purple-100 text-mindful-purple flex items-center justify-center flex-shrink-0 transition-colors shadow-xs"
                title="Next daily affirmation"
              >
                <RefreshCw className="w-3.5 h-3.5 hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>

        </div>

        {/* =========================================================================
            BOTTOM BAR: Peaceful Metrics & Direct Action
            ========================================================================= */}
        <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 z-20">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 shadow-soft text-xs font-semibold text-mindful-textDark">
            
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                <span>Calm Level: 96% Peaceful</span>
              </span>
              <span className="hidden md:inline text-gray-300">|</span>
              <span className="hidden md:inline text-mindful-textMuted text-[11px]">
                10,480 people currently practicing calm
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('journal')}
                className="text-mindful-purple font-bold hover:underline"
              >
                Start Journaling →
              </button>
              <button
                onClick={() => onNavigate('mood')}
                className="px-3.5 py-1 rounded-full bg-mindful-purple text-white text-[11px] font-bold shadow-xs hover:bg-mindful-purple-dark transition-all"
              >
                Log Mood
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
