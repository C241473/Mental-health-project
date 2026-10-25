import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Video, 
  Flame, 
  Smile, 
  BookOpen, 
  Clock, 
  CheckSquare, 
  ArrowRight, 
  TrendingUp,
  UserCheck,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Plus,
  Check,
  CheckCircle2,
  Activity,
  Award,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';

export default function DashboardView({ 
  currentUser, 
  onNavigate, 
  loggedMoods = [], 
  journalEntries = [],
  bookings = [],
  selfCareGoals = [],
  onToggleGoal,
  onAddGoal,
  onQuickJournalSave
}) {
  // Analytics report view: 'weekly' or 'monthly'
  const [reportType, setReportType] = useState('weekly');
  
  // Quick reflection input state
  const [quickThought, setQuickThought] = useState('');
  const [quickThoughtSuccess, setQuickThoughtSuccess] = useState(false);

  // New goal input state
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');

  // Video session modal
  const [showVideoModal, setShowVideoModal] = useState(false);

  // 1. Dynamic Calculations: Mood Scores & Mapping
  const moodScoreMap = { 'great': 5, 'good': 4, 'okay': 3, 'bad': 2, 'very-bad': 1 };

  // Calculate real Weekly Mood Data (Mon to Sun)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Realistic base values merged with actual user logs
  const baseWeeklyScores = [3.8, 4.0, 4.5, 4.2, 4.8, 4.3, 4.6];
  
  const weeklyMoodData = daysOfWeek.map((day, idx) => {
    // If user has logs, synthesize real score trend
    const recentScore = loggedMoods.length > idx 
      ? (loggedMoods[idx]?.score || moodScoreMap[loggedMoods[idx]?.mood] || baseWeeklyScores[idx])
      : baseWeeklyScores[idx];

    let color = 'bg-mindful-purple';
    let label = 'Great';
    if (recentScore < 3.0) {
      color = 'bg-mindful-coral';
      label = 'Challenging';
    } else if (recentScore < 3.8) {
      color = 'bg-amber-400';
      label = 'Okay';
    } else if (recentScore < 4.5) {
      color = 'bg-mindful-purple-light';
      label = 'Good';
    }

    const heightPct = Math.round((recentScore / 5) * 100);

    return {
      day,
      score: recentScore.toFixed(1),
      label,
      height: `${heightPct}%`,
      color
    };
  });

  // Monthly 4-Week Trend Data
  const monthlyWeeksData = [
    { week: 'Week 1 (Aug 1 - 7)', score: 3.9, positivePct: 72, entries: 8, label: 'Balanced' },
    { week: 'Week 2 (Aug 8 - 14)', score: 4.1, positivePct: 80, entries: 11, label: 'Gaining Momentum' },
    { week: 'Week 3 (Aug 15 - 21)', score: 4.4, positivePct: 86, entries: 14, label: 'High Wellness' },
    { week: 'Week 4 (Aug 22 - 28)', score: 4.6, positivePct: 91, entries: 12, label: 'Peak Flourishing' },
  ];

  // User Activity Statistics
  const weeklyAverage = (
    weeklyMoodData.reduce((acc, curr) => acc + parseFloat(curr.score), 0) / 7
  ).toFixed(1);

  const completedGoalsCount = selfCareGoals.filter(g => g.done).length;
  const totalGoalsCount = selfCareGoals.length || 1;
  const goalsCompletionPct = Math.round((completedGoalsCount / totalGoalsCount) * 100);

  // Highest & Lowest weekly days
  const peakDay = [...weeklyMoodData].sort((a, b) => parseFloat(b.score) - parseFloat(a.score))[0];
  const lowestDay = [...weeklyMoodData].sort((a, b) => parseFloat(a.score) - parseFloat(b.score))[0];

  // Handle Quick Journal Submission
  const handleSaveQuickJournal = (e) => {
    e.preventDefault();
    if (!quickThought.trim()) return;

    if (onQuickJournalSave) {
      onQuickJournalSave({
        id: Date.now(),
        title: 'Daily Reflection Spark',
        content: quickThought.trim(),
        category: 'Daily Wins',
        promptUsed: 'What made you feel proud of yourself today?',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: '1 min read'
      });
    }

    setQuickThought('');
    setQuickThoughtSuccess(true);
    setTimeout(() => setQuickThoughtSuccess(false), 3500);
  };

  // Handle adding a new self-care goal
  const handleAddNewGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    if (onAddGoal) {
      onAddGoal({
        id: Date.now(),
        label: newGoalText.trim(),
        done: false,
        category: 'Habit'
      });
    }
    setNewGoalText('');
    setShowAddGoal(false);
  };

  // Upcoming appointment resolution
  const nextAppointment = bookings.length > 0 ? bookings[0] : {
    therapist: 'Dr. Sarah Ahmed',
    role: 'Clinical Psychologist',
    date: 'Today',
    time: '4:00 PM (45 min)',
    type: 'Video Consultation',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=160'
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Welcome Banner with Streak & Quick Navigation */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-mindful-purple via-mindful-purple-light to-mindful-peach text-white shadow-floating flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Wellness Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {currentUser?.name || 'Alex'}! 🌿
          </h1>
          <p className="text-sm text-white/90 max-w-xl">
            You're doing fantastic. Your mindful habit streak is currently at <strong>7 days</strong>. Take a breath and explore your emotion analytics.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('mood')}
            className="px-5 py-3 rounded-full bg-white text-mindful-purple text-xs font-bold shadow-md hover:bg-mindful-bg transition-all transform hover:scale-[1.02]"
          >
            Log Today's Mood
          </button>
          <button
            onClick={() => onNavigate('booking')}
            className="px-5 py-3 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold hover:bg-white/30 transition-all border border-white/40"
          >
            Book Therapy
          </button>
        </div>
      </div>

      {/* 2. User Activity Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Stat 1: Consistency Streak */}
        <div className="p-6 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-3 hover:border-mindful-purple-subtle transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mindful-textMuted uppercase tracking-wider">Logging Streak</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-mindful-textDark">7 Days</p>
            <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              Personal best this month
            </p>
          </div>
        </div>

        {/* Stat 2: Weekly Mood Average */}
        <div className="p-6 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-3 hover:border-mindful-purple-subtle transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mindful-textMuted uppercase tracking-wider">Weekly Mood Avg</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-mindful-purple flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-mindful-textDark">{weeklyAverage} / 5.0</p>
            <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +9% vs last week
            </p>
          </div>
        </div>

        {/* Stat 3: Daily Goals Completion Rate */}
        <div className="p-6 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-3 hover:border-mindful-purple-subtle transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mindful-textMuted uppercase tracking-wider">Self-Care Habits</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-mindful-textDark">{goalsCompletionPct}%</p>
            <p className="text-[11px] font-semibold text-mindful-textMuted mt-0.5">
              {completedGoalsCount} of {totalGoalsCount} goals done today
            </p>
          </div>
        </div>

        {/* Stat 4: Journal Reflections Count */}
        <div className="p-6 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-3 hover:border-mindful-purple-subtle transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mindful-textMuted uppercase tracking-wider">Journal Vault</span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-mindful-textDark">{journalEntries.length}</p>
            <p className="text-[11px] font-semibold text-mindful-textMuted mt-0.5">
              Saved private reflections
            </p>
          </div>
        </div>

      </div>

      {/* 3. Analytics Features: Weekly & Monthly Mood Reports with Mood Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Interactive Mood Reports & Trend Charts */}
        <div className="lg:col-span-8 p-8 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-6">
          
          {/* Header & Report Toggle Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-mindful-purple" />
                <h2 className="text-xl font-bold text-mindful-textDark">
                  {reportType === 'weekly' ? 'Weekly Mood Report & Trend' : 'Monthly Mood Report & Analytics'}
                </h2>
              </div>
              <p className="text-xs text-mindful-textMuted mt-0.5">
                {reportType === 'weekly' 
                  ? '7-Day emotional trajectory and activity correlation'
                  : '30-Day macro wellness progression and habit impact'}
              </p>
            </div>

            {/* Toggle Buttons: Weekly vs Monthly */}
            <div className="p-1 rounded-2xl bg-mindful-bg border border-gray-200/80 flex items-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setReportType('weekly')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  reportType === 'weekly'
                    ? 'bg-mindful-purple text-white shadow-xs'
                    : 'text-mindful-textMuted hover:text-mindful-textDark'
                }`}
              >
                Weekly Report
              </button>
              <button
                type="button"
                onClick={() => setReportType('monthly')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  reportType === 'monthly'
                    ? 'bg-mindful-purple text-white shadow-xs'
                    : 'text-mindful-textMuted hover:text-mindful-textDark'
                }`}
              >
                Monthly Report
              </button>
            </div>
          </div>

          {/* VIEW 1: WEEKLY MOOD REPORT & TREND CHART */}
          {reportType === 'weekly' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Bar Chart Visualization */}
              <div className="h-56 pt-6 flex items-end justify-between gap-3 border-b border-gray-100 pb-4">
                {weeklyMoodData.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Hover Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-mindful-textDark text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none shadow-md z-20 whitespace-nowrap">
                      {item.score}/5.0 • {item.label}
                    </div>

                    <span className="text-[10px] font-bold text-mindful-purple">
                      {item.score}
                    </span>

                    <div className="w-full bg-mindful-bg rounded-t-2xl overflow-hidden h-40 flex items-end p-1 border border-gray-100">
                      <div
                        className={`w-full rounded-t-xl ${item.color} group-hover:brightness-110 transition-all duration-500`}
                        style={{ height: item.height }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-mindful-textDark">{item.day}</span>
                  </div>
                ))}
              </div>

              {/* Weekly Highlights & Key Takeaways */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
                  <span className="text-[11px] font-bold text-mindful-purple uppercase tracking-wider">Peak Happiness Day</span>
                  <p className="text-sm font-extrabold text-mindful-textDark">{peakDay.day} ({peakDay.score}/5.0)</p>
                  <p className="text-[10px] text-mindful-textMuted">Correlated with Nature Walk & Rest</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100 space-y-1">
                  <span className="text-[11px] font-bold text-mindful-peach uppercase tracking-wider">Lowest Vulnerable Day</span>
                  <p className="text-sm font-extrabold text-mindful-textDark">{lowestDay.day} ({lowestDay.score}/5.0)</p>
                  <p className="text-[10px] text-mindful-textMuted">Elevated work deadline stress</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Wellness Target</span>
                  <p className="text-sm font-extrabold text-emerald-700">Target Met ✓</p>
                  <p className="text-[10px] text-emerald-600 font-medium">Maintained above 4.0 average</p>
                </div>
              </div>

              {/* AI Mindful Weekly Observation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-peach-50/20 to-orange-50 border border-purple-100 text-xs text-mindful-textDark space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-mindful-purple">
                  <Sparkles className="w-4 h-4 text-mindful-peach" />
                  <span>Weekly Mindful Insight:</span>
                </div>
                <p className="text-mindful-textMuted leading-relaxed">
                  "Your emotional state saw a notable +18% jump in tranquility on Wednesday and Friday after completing 10-minute morning meditations. Maintaining this routine before checking work communications is proving highly beneficial."
                </p>
              </div>
            </div>
          )}

          {/* VIEW 2: MONTHLY MOOD REPORT */}
          {reportType === 'monthly' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* 4-Week Month Breakdown */}
              <div className="space-y-3.5 pt-2">
                {monthlyWeeksData.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-mindful-bg border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-mindful-textDark">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-mindful-purple flex items-center justify-center text-[11px]">
                          {idx + 1}
                        </span>
                        <span>{item.week}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {item.positivePct}% Positive
                        </span>
                        <span className="text-mindful-purple font-extrabold text-sm">{item.score} / 5.0</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-gray-100">
                      <div
                        className="h-full bg-gradient-to-r from-mindful-purple to-mindful-peach rounded-full transition-all duration-700"
                        style={{ width: `${(item.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Monthly Executive Analytics Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
                  <span className="text-xs text-mindful-textMuted font-bold">Month Average</span>
                  <p className="text-2xl font-extrabold text-mindful-purple">4.25 / 5.0</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">+0.3 from last month</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
                  <span className="text-xs text-mindful-textMuted font-bold">Total Logs Recorded</span>
                  <p className="text-2xl font-extrabold text-mindful-peach">45 Logs</p>
                  <p className="text-[10px] text-mindful-textMuted">88% consistency rate</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1">
                  <span className="text-xs text-mindful-textMuted font-bold">Emotional Stability</span>
                  <p className="text-2xl font-extrabold text-emerald-600">92% Index</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Low emotional volatility</p>
                </div>
              </div>

              {/* Top Monthly Activity Correlation */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1.5 text-xs">
                <strong className="text-mindful-textDark font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-mindful-purple" />
                  Top Monthly Wellbeing Factor:
                </strong>
                <p className="text-mindful-textMuted leading-relaxed">
                  Across 30 days, sessions involving <strong>Nature Walks</strong> and <strong>Therapy Consultations</strong> registered a 96% correlation with positive reflection entries.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Right Section: Next Telehealth Session Card */}
        <div className="lg:col-span-4 p-7 rounded-3xl bg-gradient-to-br from-[#F5EFFB] to-[#FAF8F5] border border-white shadow-soft flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-mindful-purple bg-white px-3 py-1 rounded-full shadow-xs">
                Next Appointment
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Confirmed
              </span>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <img
                src={nextAppointment.img || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=160'}
                alt={nextAppointment.therapist}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-mindful-purple-subtle"
              />
              <div>
                <h3 className="text-sm font-bold text-mindful-textDark">{nextAppointment.therapist}</h3>
                <p className="text-xs text-mindful-textMuted">{nextAppointment.role || 'Clinical Psychologist'}</p>
                <div className="flex items-center gap-2 text-[11px] text-mindful-purple font-semibold mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{nextAppointment.date} • {nextAppointment.time}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowVideoModal(true)}
              className="w-full py-3 rounded-2xl bg-mindful-purple text-white text-xs font-bold shadow-soft hover:bg-mindful-purple-dark transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
            >
              <Video className="w-4 h-4" />
              Join Video Room
            </button>
            
            <button
              onClick={() => onNavigate('booking')}
              className="w-full py-2.5 rounded-2xl bg-white text-mindful-textMuted hover:text-mindful-textDark text-xs font-bold transition-colors border border-gray-100"
            >
              Book Another Session
            </button>
          </div>
        </div>

      </div>

      {/* 4. Bottom Interactive Tools: Self-Care Goals Checklist & Quick Journal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Interactive Daily Goals Checklist */}
        <div className="p-7 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-mindful-textDark flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-mindful-purple" />
              Daily Self-Care Goals ({completedGoalsCount}/{totalGoalsCount})
            </h3>
            
            <button
              type="button"
              onClick={() => setShowAddGoal(!showAddGoal)}
              className="text-xs font-bold text-mindful-purple hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Habit
            </button>
          </div>

          {/* Add Goal Input */}
          {showAddGoal && (
            <form onSubmit={handleAddNewGoal} className="flex gap-2 animate-in fade-in">
              <input
                type="text"
                placeholder="e.g. 15-minute afternoon walk..."
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-mindful-bg text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-mindful-purple"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-mindful-purple text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Add
              </button>
            </form>
          )}

          {/* Goal Items */}
          <div className="space-y-2.5">
            {selfCareGoals.map((goal) => (
              <label 
                key={goal.id} 
                className="flex items-center justify-between p-3.5 rounded-2xl bg-mindful-bg border border-gray-100 cursor-pointer hover:bg-purple-50/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={goal.done}
                    onChange={() => onToggleGoal && onToggleGoal(goal.id)}
                    className="w-4 h-4 text-mindful-purple rounded accent-mindful-purple cursor-pointer"
                  />
                  <span className={`text-xs font-semibold ${goal.done ? 'line-through text-gray-400' : 'text-mindful-textDark'}`}>
                    {goal.label}
                  </span>
                </div>
                {goal.done && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Done ✓
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Quick Reflection Prompt box */}
        <div className="p-7 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-mindful-textDark flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-mindful-peach" />
              Quick Journal Reflection
            </h3>
            <p className="text-xs text-mindful-textMuted italic">
              "What made you feel proud of yourself or grateful today?"
            </p>
          </div>

          <form onSubmit={handleSaveQuickJournal} className="space-y-3">
            <textarea
              placeholder="Capture a quick spontaneous thought before it fades..."
              value={quickThought}
              onChange={(e) => setQuickThought(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-mindful-bg border border-gray-200 text-xs text-mindful-textDark focus:outline-none focus:border-mindful-purple resize-none h-24 leading-relaxed"
            ></textarea>

            <div className="flex items-center justify-between pt-1">
              {quickThoughtSuccess ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved to your journal!
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('journal')}
                  className="text-xs font-bold text-mindful-purple hover:underline"
                >
                  Open Full Journal →
                </button>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-mindful-purple text-white text-xs font-bold shadow-soft hover:bg-mindful-purple-dark transition-all transform hover:scale-[1.02]"
              >
                Save to Journal
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Video Consultation Simulation Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mindful-textDark/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-mindful-purple-subtle shadow-floating space-y-5 text-center relative">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-mindful-bg hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full bg-purple-50 text-mindful-purple mx-auto flex items-center justify-center">
              <Video className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-mindful-textDark">Secure Telehealth Room</h3>
              <p className="text-xs text-mindful-textMuted">Connecting you to {nextAppointment.therapist}...</p>
            </div>

            <div className="p-4 rounded-2xl bg-mindful-bg text-xs space-y-2 border border-gray-100 text-left">
              <div className="flex justify-between">
                <span className="text-mindful-textMuted">Provider:</span>
                <strong className="text-mindful-textDark">{nextAppointment.therapist}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-mindful-textMuted">Room Security:</span>
                <strong className="text-emerald-600">End-to-End Encrypted (HIPAA)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-mindful-textMuted">Camera & Mic:</span>
                <strong className="text-mindful-purple">Ready</strong>
              </div>
            </div>

            <button
              onClick={() => {
                alert("You have entered the waiting room. Your therapist will admit you momentarily.");
                setShowVideoModal(false);
              }}
              className="w-full py-3 rounded-full bg-mindful-purple text-white text-xs font-bold shadow-soft hover:bg-mindful-purple-dark transition-all"
            >
              Enter Telehealth Waiting Room
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
