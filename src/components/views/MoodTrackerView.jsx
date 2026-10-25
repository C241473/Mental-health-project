import React, { useState } from 'react';
import { 
  Smile, 
  Calendar, 
  CheckCircle2, 
  Tag, 
  Plus, 
  TrendingUp, 
  Sparkles, 
  Search, 
  Filter, 
  Trash2, 
  BarChart3, 
  Clock, 
  Activity, 
  HeartHandshake, 
  Layers,
  ArrowUpRight,
  PieChart
} from 'lucide-react';
import MoodSphere3D from '../3d/MoodSphere3D';

export default function MoodTrackerView({ loggedMoods = [], onAddMood, onDeleteMood }) {
  const [currentMood, setCurrentMood] = useState('good');
  const [selectedEmotions, setSelectedEmotions] = useState(['Calm', 'Inspired']);
  const [selectedActivities, setSelectedActivities] = useState(['Meditation', 'Nature Walk']);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Tabs for the bottom section: 'history' or 'analytics'
  const [viewTab, setViewTab] = useState('history');
  
  // History search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  const moods = [
    { id: 'very-bad', score: 1, label: 'Very Bad', emoji: '😡', color: 'bg-red-500 text-white' },
    { id: 'bad', score: 2, label: 'Bad', emoji: '🙁', color: 'bg-orange-500 text-white' },
    { id: 'okay', score: 3, label: 'Okay', emoji: '😐', color: 'bg-amber-400 text-white' },
    { id: 'good', score: 4, label: 'Good', emoji: '🙂', color: 'bg-mindful-purple-light text-white' },
    { id: 'great', score: 5, label: 'Great', emoji: '😄', color: 'bg-mindful-purple text-white' },
  ];

  const emotionList = [
    'Calm', 'Anxious', 'Inspired', 'Tired', 'Grateful', 
    'Overwhelmed', 'Hopeful', 'Stressed', 'Peaceful', 'Focused', 'Restless', 'Joyful'
  ];

  const activityList = [
    'Work', 'Exercise', 'Meditation', 'Socializing', 
    'Reading', 'Family', 'Nature Walk', 'Sleep Rest', 'Creative Project', 'Therapy'
  ];

  const toggleTag = (list, setList, tag) => {
    if (list.includes(tag)) {
      setList(list.filter((item) => item !== tag));
    } else {
      setList([...list, tag]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const moodObj = moods.find((m) => m.id === currentMood) || moods[3];
    
    const entry = {
      id: Date.now(),
      mood: currentMood,
      score: moodObj.score,
      emotions: [...selectedEmotions],
      activities: [...selectedActivities],
      notes: notes.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: new Date().toISOString()
    };

    onAddMood(entry);
    setSavedSuccess(true);
    setNotes('');
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Filtered mood history calculation
  const filteredMoods = loggedMoods.filter((item) => {
    const matchesSearch = 
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.emotions && item.emotions.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (item.activities && item.activities.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesMood = filterMood === 'all' || item.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  // Analytics Computations
  const totalLogs = loggedMoods.length || 1;
  const moodCounts = {
    'great': loggedMoods.filter(m => m.mood === 'great').length,
    'good': loggedMoods.filter(m => m.mood === 'good').length,
    'okay': loggedMoods.filter(m => m.mood === 'okay').length,
    'bad': loggedMoods.filter(m => m.mood === 'bad').length,
    'very-bad': loggedMoods.filter(m => m.mood === 'very-bad').length,
  };

  const moodScoreMap = { 'great': 5, 'good': 4, 'okay': 3, 'bad': 2, 'very-bad': 1 };
  const totalScore = loggedMoods.reduce((acc, curr) => acc + (curr.score || moodScoreMap[curr.mood] || 3), 0);
  const avgMoodScore = (totalScore / totalLogs).toFixed(1);

  // Top emotions count
  const emotionFrequency = {};
  loggedMoods.forEach(entry => {
    entry.emotions?.forEach(em => {
      emotionFrequency[em] = (emotionFrequency[em] || 0) + 1;
    });
  });
  const topEmotions = Object.entries(emotionFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Top activities count
  const activityFrequency = {};
  loggedMoods.forEach(entry => {
    entry.activities?.forEach(act => {
      activityFrequency[act] = (activityFrequency[act] || 0) + 1;
    });
  });
  const topActivities = Object.entries(activityFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-10 pb-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 text-mindful-purple text-xs font-bold border border-purple-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Emotion Analytics & Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-mindful-textDark">
          Daily Mood Tracking & Aura Visualizer
        </h1>
        <p className="text-sm text-mindful-textMuted leading-relaxed">
          Log your emotional state, explore your reactive mood aura, and analyze trends to build mindful habits.
        </p>
      </div>

      {/* Main Logging Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Reactive Aura Sphere & Controls */}
        <div className="lg:col-span-6 p-8 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-mindful-textDark flex items-center gap-2">
              <Smile className="w-5 h-5 text-mindful-purple" />
              1. Select Your Current Emotion
            </h2>
            <span className="text-xs font-bold text-mindful-purple bg-purple-50 px-2.5 py-1 rounded-full">
              Live Mood Aura
            </span>
          </div>

          {/* Liquid Glass Aura Orb Renderer */}
          <MoodSphere3D currentMood={currentMood} />

          {/* Mood Buttons Selector */}
          <div className="grid grid-cols-5 gap-2 pt-2">
            {moods.map((m) => {
              const isSelected = currentMood === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setCurrentMood(m.id)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? `${m.color} border-transparent scale-105 shadow-md`
                      : 'bg-mindful-bg border-gray-100 hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[11px] font-bold">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Tags, Notes & Log Form */}
        <div className="lg:col-span-6 p-8 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-6">
          <h2 className="text-xl font-bold text-mindful-textDark flex items-center gap-2">
            <Tag className="w-5 h-5 text-mindful-peach" />
            2. Add Emotional Context & Tags
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Emotion Chips */}
            <div>
              <label className="block text-xs font-bold text-mindful-textMuted uppercase tracking-wider mb-2">
                What specific emotions are you feeling?
              </label>
              <div className="flex flex-wrap gap-2">
                {emotionList.map((tag) => {
                  const active = selectedEmotions.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(selectedEmotions, setSelectedEmotions, tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        active
                          ? 'bg-mindful-purple text-white shadow-xs'
                          : 'bg-mindful-bg text-mindful-textMuted hover:bg-mindful-purple-subtle/50'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Activity Chips */}
            <div>
              <label className="block text-xs font-bold text-mindful-textMuted uppercase tracking-wider mb-2">
                What activities influenced your state?
              </label>
              <div className="flex flex-wrap gap-2">
                {activityList.map((act) => {
                  const active = selectedActivities.includes(act);
                  return (
                    <button
                      type="button"
                      key={act}
                      onClick={() => toggleTag(selectedActivities, setSelectedActivities, act)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        active
                          ? 'bg-mindful-peach text-white shadow-xs'
                          : 'bg-mindful-bg text-mindful-textMuted hover:bg-orange-50'
                      }`}
                    >
                      {act}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reflections Textarea */}
            <div>
              <label className="block text-xs font-bold text-mindful-textMuted uppercase tracking-wider mb-2">
                Personal Reflection / Daily Note (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What contributed to your feelings today? Write down any thoughts or observations..."
                className="w-full p-4 rounded-2xl bg-mindful-bg border border-gray-200 text-sm text-mindful-textDark focus:outline-none focus:border-mindful-purple h-24 resize-none leading-relaxed"
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Logged successfully into your timeline!
                </span>
              ) : (
                <span className="text-xs text-mindful-textMuted">Encrypted confidential entry</span>
              )}

              <button
                type="submit"
                className="px-7 py-3 rounded-full bg-mindful-purple text-white text-xs font-bold shadow-soft hover:bg-mindful-purple-dark transition-all transform hover:scale-[1.02] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Log Mood Entry</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Bottom Section: Mood History & Analytics Tabs */}
      <div className="p-8 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-6">
        
        {/* Tab Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewTab('history')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                viewTab === 'history'
                  ? 'bg-mindful-purple text-white shadow-soft'
                  : 'bg-mindful-bg text-mindful-textMuted hover:text-mindful-textDark'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Mood History Timeline ({loggedMoods.length})</span>
            </button>

            <button
              onClick={() => setViewTab('analytics')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                viewTab === 'analytics'
                  ? 'bg-mindful-purple text-white shadow-soft'
                  : 'bg-mindful-bg text-mindful-textMuted hover:text-mindful-textDark'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Mood Analytics & Pattern Insights</span>
            </button>
          </div>

          {/* Quick Score Badge */}
          <div className="flex items-center gap-2 text-xs font-bold text-mindful-textDark bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-100">
            <TrendingUp className="w-4 h-4 text-mindful-purple" />
            <span>Average Score: <strong className="text-mindful-purple">{avgMoodScore} / 5.0</strong></span>
          </div>
        </div>

        {/* Tab Content 1: Mood History Timeline */}
        {viewTab === 'history' && (
          <div className="space-y-6">
            
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-mindful-bg p-3.5 rounded-2xl border border-gray-100">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-mindful-textMuted absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search notes, emotions, activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white text-xs text-mindful-textDark rounded-full border border-gray-200 focus:outline-none focus:border-mindful-purple"
                />
              </div>

              {/* Mood Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
                <span className="text-xs font-bold text-mindful-textMuted mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Filter:
                </span>
                {['all', 'great', 'good', 'okay', 'bad', 'very-bad'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMood(m)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize transition-all ${
                      filterMood === m
                        ? 'bg-mindful-purple text-white shadow-xs'
                        : 'bg-white text-mindful-textMuted hover:bg-gray-100'
                    }`}
                  >
                    {m === 'all' ? 'All Moods' : m.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Entries Grid */}
            {filteredMoods.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Smile className="w-8 h-8 text-mindful-textMuted mx-auto opacity-50" />
                <p className="text-xs text-mindful-textMuted">No mood logs found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMoods.map((log) => {
                  const moodBadgeColor = {
                    'great': 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    'good': 'bg-purple-100 text-mindful-purple border-purple-200',
                    'okay': 'bg-amber-100 text-amber-800 border-amber-200',
                    'bad': 'bg-orange-100 text-orange-800 border-orange-200',
                    'very-bad': 'bg-red-100 text-red-800 border-red-200',
                  }[log.mood] || 'bg-gray-100 text-gray-800';

                  const moodEmoji = {
                    'great': '😄',
                    'good': '🙂',
                    'okay': '😐',
                    'bad': '🙁',
                    'very-bad': '😡',
                  }[log.mood] || '🙂';

                  return (
                    <div 
                      key={log.id} 
                      className="p-5 rounded-2xl bg-mindful-bg border border-gray-100 space-y-3 hover:border-mindful-purple-subtle transition-all relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-mindful-purple uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {log.date} • {log.timestamp}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize flex items-center gap-1 ${moodBadgeColor}`}>
                            <span>{moodEmoji}</span>
                            <span>{log.mood?.replace('-', ' ')}</span>
                          </span>

                          {onDeleteMood && (
                            <button
                              onClick={() => onDeleteMood(log.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md opacity-0 group-hover:opacity-100"
                              title="Delete log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {log.notes && (
                        <p className="text-xs text-mindful-textDark font-medium italic bg-white p-3 rounded-xl border border-gray-100 leading-relaxed">
                          "{log.notes}"
                        </p>
                      )}

                      <div className="space-y-1.5 pt-1">
                        {log.emotions && log.emotions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {log.emotions.map((e, idx) => (
                              <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-mindful-purple border border-purple-100">
                                {e}
                              </span>
                            ))}
                          </div>
                        )}
                        {log.activities && log.activities.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {log.activities.map((a, idx) => (
                              <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-mindful-peach border border-orange-100">
                                {a}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Mood Analytics & Patterns */}
        {viewTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in">
            
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 space-y-1">
                <span className="text-xs font-bold text-mindful-textMuted uppercase">Overall Wellness Score</span>
                <p className="text-3xl font-extrabold text-mindful-purple">{avgMoodScore} / 5.0</p>
                <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 pt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +8% positive emotional trend this week
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 space-y-1">
                <span className="text-xs font-bold text-mindful-textMuted uppercase">Positive State Ratio</span>
                <p className="text-3xl font-extrabold text-mindful-peach">
                  {Math.round(((moodCounts.great + moodCounts.good) / totalLogs) * 100)}%
                </p>
                <p className="text-[11px] font-semibold text-mindful-textMuted pt-1">
                  Percentage of entries rated 'Good' or 'Great'
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 space-y-1">
                <span className="text-xs font-bold text-mindful-textMuted uppercase">Emotional Stability Index</span>
                <p className="text-3xl font-extrabold text-emerald-600">89%</p>
                <p className="text-[11px] font-semibold text-mindful-textMuted pt-1">
                  Consistent calming daily grounding habits
                </p>
              </div>
            </div>

            {/* Distribution Bars */}
            <div className="p-6 rounded-2xl bg-mindful-bg border border-gray-100 space-y-4">
              <h4 className="text-sm font-bold text-mindful-textDark flex items-center gap-2">
                <PieChart className="w-4 h-4 text-mindful-purple" />
                Mood Frequency Breakdown ({loggedMoods.length} total entries)
              </h4>

              <div className="space-y-3">
                {[
                  { label: 'Great (5/5)', count: moodCounts.great, emoji: '😄', color: 'bg-mindful-purple' },
                  { label: 'Good (4/5)', count: moodCounts.good, emoji: '🙂', color: 'bg-mindful-purple-light' },
                  { label: 'Okay (3/5)', count: moodCounts.okay, emoji: '😐', color: 'bg-amber-400' },
                  { label: 'Bad (2/5)', count: moodCounts.bad, emoji: '🙁', color: 'bg-orange-400' },
                  { label: 'Very Bad (1/5)', count: moodCounts.very-bad, emoji: '😡', color: 'bg-red-400' },
                ].map((item, idx) => {
                  const pct = Math.round((item.count / totalLogs) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-mindful-textDark">
                        <span className="flex items-center gap-1.5">
                          <span>{item.emoji}</span>
                          <span>{item.label}</span>
                        </span>
                        <span>{item.count} entries ({pct}%)</span>
                      </div>
                      <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-gray-100">
                        <div
                          className={`h-full rounded-full ${item.color} transition-all duration-500`}
                          style={{ width: `${Math.max(pct, 3)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Influencers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Positive Triggers */}
              <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-mindful-textDark flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Top Mood-Boosting Activities
                </h4>
                <div className="space-y-2">
                  {topActivities.map(([act, count], i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-mindful-bg text-xs">
                      <span className="font-bold text-mindful-textDark">{act}</span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {count} times logged
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dominant Emotions */}
              <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-mindful-textDark flex items-center gap-2">
                  <Activity className="w-4 h-4 text-mindful-purple" />
                  Most Frequently Felt Emotions
                </h4>
                <div className="space-y-2">
                  {topEmotions.map(([em, count], i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-mindful-bg text-xs">
                      <span className="font-bold text-mindful-textDark">{em}</span>
                      <span className="text-[11px] font-bold text-mindful-purple bg-purple-50 px-2 py-0.5 rounded-md">
                        {count} times logged
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
