import React from 'react';
import { Sparkles, Activity, Heart, Smile } from 'lucide-react';

const moodThemes = {
  'very-bad': { 
    name: 'Very Bad', 
    emoji: '😡',
    gradient: 'from-rose-500 via-red-500 to-amber-600',
    glow: 'rgba(239, 68, 68, 0.4)',
    accent: '#EF4444',
    bgTint: 'from-red-50/60 to-orange-50/30',
    description: 'Intense emotional turbulence • Deep grounding recommended'
  },
  'bad': { 
    name: 'Bad', 
    emoji: '🙁',
    gradient: 'from-orange-400 via-rose-400 to-amber-500',
    glow: 'rgba(249, 115, 22, 0.4)',
    accent: '#F97316',
    bgTint: 'from-orange-50/60 to-peach-50/30',
    description: 'Elevated stress or fatigue • Gentle breathing advised'
  },
  'okay': { 
    name: 'Okay', 
    emoji: '😐',
    gradient: 'from-amber-400 via-yellow-400 to-emerald-400',
    glow: 'rgba(245, 158, 11, 0.35)',
    accent: '#F59E0B',
    bgTint: 'from-amber-50/60 to-yellow-50/30',
    description: 'Neutral balance • Ready for intentional mindfulness'
  },
  'good': { 
    name: 'Good', 
    emoji: '🙂',
    gradient: 'from-mindful-purple via-mindful-purple-light to-mindful-peach',
    glow: 'rgba(139, 128, 195, 0.45)',
    accent: '#8B80C3',
    bgTint: 'from-purple-50/70 to-peach-50/40',
    description: 'Positive emotional equilibrium • Feeling grounded'
  },
  'great': { 
    name: 'Great', 
    emoji: '😄',
    gradient: 'from-mindful-purple via-indigo-500 to-pink-500',
    glow: 'rgba(107, 96, 158, 0.55)',
    accent: '#6B609E',
    bgTint: 'from-purple-50/80 to-indigo-50/40',
    description: 'High vitality & inspiration • Joyful flow state'
  }
};

export default function MoodSphere3D({ currentMood = 'good' }) {
  const theme = moodThemes[currentMood] || moodThemes['good'];

  return (
    <div className={`w-full h-60 md:h-72 relative rounded-3xl overflow-hidden glass-card flex flex-col items-center justify-center p-4 transition-all duration-700 bg-gradient-to-b ${theme.bgTint}`}>
      
      {/* Background Ambient Radial Diffusion */}
      <div 
        className="absolute w-56 h-56 rounded-full blur-3xl opacity-40 transition-colors duration-700 pointer-events-none"
        style={{ backgroundColor: theme.glow }}
      ></div>

      {/* Interactive Pulsing Aura Visualizer */}
      <div className="relative flex items-center justify-center">
        
        {/* Outermost Expanding Pulse Ring */}
        <div 
          className="absolute w-44 h-44 rounded-full border-2 border-dashed transition-all duration-700 animate-spin"
          style={{ borderColor: theme.accent, animationDuration: '24s', opacity: 0.35 }}
        ></div>

        {/* Secondary Ripple Ring */}
        <div 
          className="absolute w-36 h-36 rounded-full border border-white/60 shadow-floating transition-all duration-500 animate-ping"
          style={{ animationDuration: '4s', opacity: 0.2 }}
        ></div>

        {/* Main Liquid Glass Aura Orb */}
        <div 
          className={`w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr ${theme.gradient} shadow-floating flex items-center justify-center relative transform hover:scale-105 transition-all duration-500 cursor-pointer group`}
          style={{ boxShadow: `0 20px 45px -10px ${theme.glow}` }}
        >
          {/* Internal Specular Glass Highlight */}
          <div className="absolute top-2 left-3 w-8 h-8 rounded-full bg-white/40 blur-xs"></div>
          <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-black/10 blur-xs"></div>

          {/* Central Mood Emoji */}
          <span className="text-4xl md:text-5xl select-none transform group-hover:scale-110 transition-transform">
            {theme.emoji}
          </span>
        </div>
      </div>

      {/* Aura Frequency Pill */}
      <div className="mt-4 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/90 shadow-xs flex items-center gap-2 z-10">
        <span 
          className="w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: theme.accent }}
        ></span>
        <span className="text-xs font-bold text-mindful-textDark">
          Emotional Frequency: <strong style={{ color: theme.accent }}>{theme.name}</strong>
        </span>
      </div>

      {/* Calming Insight description */}
      <p className="text-[11px] font-medium text-mindful-textMuted text-center mt-1 z-10 max-w-xs">
        {theme.description}
      </p>

    </div>
  );
}
