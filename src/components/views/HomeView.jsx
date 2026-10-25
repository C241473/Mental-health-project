import React, { useState } from 'react';
import { 
  Smile, 
  Users, 
  Calendar, 
  Star, 
  ArrowRight, 
  MessageSquare, 
  BookOpen, 
  Heart, 
  UserCheck, 
  CheckCircle,
  Quote,
  Sparkles,
  Send,
  ShieldCheck,
  Video,
  PenTool,
  Clock,
  Compass,
  Check
} from 'lucide-react';
import MindfulHeroInteractive from '../interactive/MindfulHeroInteractive';

export default function HomeView({ onNavigate, onQuickMoodLog, onQuickJournalSave, loggedMoods }) {
  const [selectedQuickMood, setSelectedQuickMood] = useState('good');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedToast, setSubscribedToast] = useState(false);
  const [moodLoggedToast, setMoodLoggedToast] = useState(false);

  // Quick Journal State on Home
  const [quickReflection, setQuickReflection] = useState('');
  const [journalSavedToast, setJournalSavedToast] = useState(false);

  const moodOptions = [
    { id: 'very-bad', label: 'Very Bad', emoji: '😡', color: 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200' },
    { id: 'bad', label: 'Bad', emoji: '🙁', color: 'bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200' },
    { id: 'okay', label: 'Okay', emoji: '😐', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200' },
    { id: 'good', label: 'Good', emoji: '🙂', color: 'bg-purple-100 text-mindful-purple border-purple-200 hover:bg-purple-200' },
    { id: 'great', label: 'Great', emoji: '😄', color: 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200' },
  ];

  const handleTrackMood = () => {
    if (onQuickMoodLog) {
      onQuickMoodLog(selectedQuickMood);
    }
    setMoodLoggedToast(true);
    setTimeout(() => setMoodLoggedToast(false), 3000);
  };

  const handleSaveQuickJournal = (e) => {
    e.preventDefault();
    if (!quickReflection.trim()) return;

    if (onQuickJournalSave) {
      onQuickJournalSave({
        title: 'Daily Reflection from Sanctuary',
        content: quickReflection.trim(),
        mood: selectedQuickMood,
        category: 'Reflection',
        tags: ['Daily', 'Mindfulness', 'HomePrompt']
      });
    }

    setJournalSavedToast(true);
    setQuickReflection('');
    setTimeout(() => setJournalSavedToast(false), 3500);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribedToast(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribedToast(false), 3500);
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* =========================================================================
          HERO SECTION: Grand Centered Sanctuary with Balanced Hero Centerpiece
          - Centered layout (NOT pushed to one side)
          - Full widescreen view where the person's face is 100% visible
          ========================================================================= */}
      <section className="relative pt-10 pb-12 rounded-3xl bg-gradient-to-br from-[#FAF8F5] via-[#F4EFFC] to-[#FFF3F0] px-4 sm:px-8 lg:px-12 border border-white/80 shadow-soft overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-mindful-purple/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-mindful-peach/15 blur-3xl pointer-events-none"></div>

        <div className="space-y-10 relative z-10">
          
          {/* Centered Headline & Action Area */}
          <div className="max-w-3xl mx-auto text-center space-y-5">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white shadow-xs text-xs font-bold text-mindful-purple">
              <Sparkles className="w-3.5 h-3.5 text-mindful-peach" />
              <span>🌸 Mindful Sanctuary • Daily Mental Health Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-mindful-textDark font-sans leading-[1.15] tracking-tight">
              Mental health <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mindful-purple via-mindful-purple-light to-mindful-peach">
                matters.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-mindful-textMuted max-w-2xl mx-auto leading-relaxed font-medium">
              You don't have to face it alone. We're here to listen, support, and help you find peace every day with compassionate licensed professionals, personal journaling, and emotional tracking.
            </p>

            {/* Centered Primary CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('therapists')}
                className="px-7 py-3.5 rounded-full bg-mindful-purple text-white font-bold text-sm shadow-floating hover:bg-mindful-purple-dark transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Talk to Someone
              </button>

              <button
                onClick={() => onNavigate('journal')}
                className="px-6 py-3.5 rounded-full bg-white/95 backdrop-blur-md text-mindful-purple border border-mindful-purple/30 font-bold text-sm hover:bg-white hover:border-mindful-purple transition-all flex items-center gap-2 shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                Start Daily Journal
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById('wellbeing-grid');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3.5 rounded-full text-mindful-textDark bg-white/60 border border-gray-200 font-bold text-sm hover:bg-white hover:text-mindful-purple transition-all flex items-center gap-1.5"
              >
                Explore Tools
                <ArrowRight className="w-4 h-4 text-mindful-purple" />
              </button>
            </div>

            {/* Centered Social Proof */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" alt="User 1" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="User 2" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" alt="User 3" />
              </div>
              <p className="text-xs font-semibold text-mindful-textMuted">
                <strong className="text-mindful-textDark">10,000+ people</strong> practicing emotional wellness & calm
              </p>
            </div>

          </div>

          {/* Majestic Centerpiece Showcase:
              - Perfectly centered in layout (max-w-5xl mx-auto)
              - 16:9 widescreen ratio ensures the woman's face is 100% visible and uncropped
              - Interactive Zen Audio Soundscapes & Guided Breathwork */}
          <div className="max-w-5xl mx-auto">
            <MindfulHeroInteractive onNavigate={onNavigate} />
          </div>

        </div>
      </section>


      {/* =========================================================================
          KEY STATS BANNER
          ========================================================================= */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { icon: Smile, stat: '10K+', label: 'Happy Users', bg: 'bg-orange-50', iconColor: 'text-orange-500' },
          { icon: Users, stat: '200+', label: 'Licensed Therapists', bg: 'bg-purple-50', iconColor: 'text-mindful-purple' },
          { icon: Calendar, stat: '15K+', label: 'Appointments Booked', bg: 'bg-amber-50', iconColor: 'text-amber-500' },
          { icon: Star, stat: '4.8/5', label: 'User Rating', bg: 'bg-indigo-50', iconColor: 'text-indigo-500' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft hover:shadow-floating transition-all transform hover:-translate-y-1 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.iconColor} flex items-center justify-center flex-shrink-0`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-mindful-textDark">{item.stat}</h3>
              <p className="text-xs font-semibold text-mindful-textMuted">{item.label}</p>
            </div>
          </div>
        ))}
      </section>


      {/* =========================================================================
          SCROLL SHOWCASE 1: Daily Journaling & Mindful Reflection
          (Utilizing matching artwork: mindful-journal.jpg)
          ========================================================================= */}
      <section className="rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft overflow-hidden p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Generated Aesthetic Journal Illustration */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-floating group">
            <div className="relative h-[340px] sm:h-[380px] w-full overflow-hidden">
              <img
                src="/images/mindful-journal.jpg"
                alt="Tranquil personal journal with lavender flowers and herbal tea"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Badges on image */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white text-xs font-bold text-mindful-purple shadow-soft flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-mindful-purple" />
                <span>Private & Encrypted Journal</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/80 shadow-soft text-xs text-mindful-textDark flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  End-to-End Local Privacy Guaranteed
                </span>
                <span className="text-mindful-purple font-bold">100% Secure</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Daily Reflection Input */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-mindful-purple bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                Daily Reflection & Emotional Clarity
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mindful-textDark leading-snug">
                Write freely. Unburden your thoughts.
              </h2>
              <p className="text-sm text-mindful-textMuted leading-relaxed">
                Journaling regularly reduces cortisol levels and boosts emotional resilience. Write a quick reflection below or access your comprehensive journal.
              </p>
            </div>

            {/* Today's Gentle Prompt */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/80">
              <p className="text-xs font-bold text-mindful-purple flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Today's Prompt:
              </p>
              <p className="text-xs font-medium text-mindful-textDark italic">
                "What is one small moment of grace, beauty, or peace you noticed today?"
              </p>
            </div>

            {/* Quick Reflection Form */}
            <form onSubmit={handleSaveQuickJournal} className="space-y-3">
              <div className="relative">
                <textarea
                  value={quickReflection}
                  onChange={(e) => setQuickReflection(e.target.value)}
                  placeholder="Jot down a quick thought, gratitude, or feeling..."
                  rows={3}
                  className="w-full p-4 rounded-2xl bg-mindful-bg border border-mindful-purple-subtle/50 text-xs sm:text-sm text-mindful-textDark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mindful-purple/30 resize-none"
                />
                <span className="absolute bottom-3 right-3 text-[10px] text-mindful-textMuted font-medium">
                  {quickReflection.length} characters
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                {journalSavedToast ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle className="w-4 h-4" />
                    Saved to your Journal entries!
                  </span>
                ) : (
                  <span className="text-[11px] text-mindful-textMuted">
                    Saved automatically to your personal history.
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={!quickReflection.trim()}
                    className="px-5 py-2.5 rounded-full bg-mindful-purple text-white text-xs font-bold shadow-soft hover:bg-mindful-purple-dark disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    Save Note
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('journal')}
                    className="px-4 py-2.5 rounded-full bg-purple-50 text-mindful-purple border border-purple-200 text-xs font-bold hover:bg-purple-100 transition-colors flex items-center gap-1"
                  >
                    <span>Full Journal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>

          </div>

        </div>
      </section>


      {/* =========================================================================
          EVERYTHING YOU NEED FOR YOUR WELL-BEING (CORE FEATURES GRID)
          ========================================================================= */}
      <section id="wellbeing-grid" className="p-8 sm:p-10 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mindful-textDark flex items-center gap-2">
              Everything you need for your well-being
              <Heart className="w-5 h-5 text-mindful-peach fill-mindful-peach" />
            </h2>
            <p className="text-sm text-mindful-textMuted mt-1">Explore our complete set of interactive mental wellness tools.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: 'mood',
              icon: Smile,
              title: 'Mood Tracker & Aura',
              desc: 'Log daily emotions, observe weekly and monthly trends, and balance your mind.',
              color: 'bg-orange-100 text-orange-600'
            },
            {
              id: 'journal',
              icon: BookOpen,
              title: 'Personal Journal',
              desc: 'Reflect with guided prompts, mood tags, search, and private local encryption.',
              color: 'bg-purple-100 text-mindful-purple'
            },
            {
              id: 'community',
              icon: Users,
              title: 'Community Forum',
              desc: 'Connect with empathetic peers, share coping strategies, and celebrate small wins.',
              color: 'bg-indigo-100 text-indigo-600'
            },
            {
              id: 'therapists',
              icon: UserCheck,
              title: 'Licensed Therapists',
              desc: 'Find certified clinical psychologists and counselors specialized in your needs.',
              color: 'bg-pink-100 text-pink-600'
            },
            {
              id: 'booking',
              icon: Calendar,
              title: 'Appointment Booking',
              desc: 'Book confidential video sessions and manage your wellness consultations easily.',
              color: 'bg-blue-100 text-blue-600'
            },
            {
              id: 'profile',
              icon: Star,
              title: 'Profile & Analytics',
              desc: 'Manage your personal goals, notification reminders, security, and session data.',
              color: 'bg-amber-100 text-amber-600'
            },
          ].map((feature) => (
            <div
              key={feature.id}
              onClick={() => onNavigate(feature.id)}
              className="group p-6 rounded-2xl bg-mindful-bg/60 border border-mindful-purple-subtle/30 hover:bg-white hover:border-mindful-purple/40 hover:shadow-floating transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-mindful-textDark group-hover:text-mindful-purple transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-mindful-textMuted leading-relaxed">
                  {feature.desc}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1 text-xs font-bold text-mindful-purple group-hover:translate-x-1 transition-transform">
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* =========================================================================
          SCROLL SHOWCASE 2: Professional Guidance & Compassionate Therapy
          (Utilizing matching artwork: mindful-therapy.jpg)
          ========================================================================= */}
      <section className="rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft overflow-hidden p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Top Therapists List & Features */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Verified Clinical Guidance
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mindful-textDark leading-snug">
                Compassionate therapists who listen and guide.
              </h2>
              <p className="text-sm text-mindful-textMuted leading-relaxed">
                Connect with accredited mental health specialists in private, encrypted video consultations tailored to your personal healing journey.
              </p>
            </div>

            {/* Specialist Mini Cards */}
            <div className="space-y-3">
              {[
                { name: 'Dr. Sarah Ahmed', role: 'Clinical Psychologist', exp: '12 yrs exp', rating: '4.9', tags: ['Anxiety', 'CBT'], img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120' },
                { name: 'Dr. Nusrat Jehan', role: 'Counseling Psychologist', exp: '9 yrs exp', rating: '4.8', tags: ['Mindfulness', 'Stress'], img: 'https://images.unsplash.com/photo-1594824813566-88855ce78905?auto=format&fit=crop&q=80&w=120' },
                { name: 'Dr. Arman Rahman', role: 'Psychotherapist', exp: '8 yrs exp', rating: '4.7', tags: ['Trauma', 'Burnout'], img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=120' },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-mindful-bg/70 border border-gray-100 hover:bg-white hover:shadow-xs transition-all">
                  <div className="flex items-center gap-3">
                    <img src={doc.img} alt={doc.name} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-mindful-textDark">{doc.name}</h4>
                      <p className="text-[11px] text-mindful-textMuted">{doc.role} • {doc.exp}</p>
                      <div className="flex gap-1.5 mt-1">
                        {doc.tags.map(t => (
                          <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-mindful-purple">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{doc.rating}</span>
                    </div>
                    <button
                      onClick={() => onNavigate('booking')}
                      className="text-[11px] font-bold text-mindful-purple hover:underline"
                    >
                      Book →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('booking')}
                className="px-6 py-3 rounded-full bg-mindful-purple text-white text-xs font-bold shadow-soft hover:bg-mindful-purple-dark transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book Video Session
              </button>

              <button
                onClick={() => onNavigate('therapists')}
                className="px-5 py-3 rounded-full bg-white text-mindful-textDark border border-mindful-purple-subtle text-xs font-bold hover:bg-mindful-bg transition-colors flex items-center gap-1"
              >
                <span>View All 200+ Specialists</span>
                <ArrowRight className="w-3.5 h-3.5 text-mindful-purple" />
              </button>
            </div>

          </div>

          {/* Right Column: Generated Aesthetic Therapy Consultation Illustration */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-floating group">
            <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden">
              <img
                src="/images/mindful-therapy.jpg"
                alt="Compassionate psychotherapy session with warm tea and soothing sunlight"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Badges on image */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white text-xs font-bold text-mindful-purple shadow-soft flex items-center gap-2">
                <Video className="w-4 h-4 text-mindful-purple" />
                <span>Telehealth Video Consultations</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/80 shadow-soft text-xs text-mindful-textDark flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Next Available Slot: Today at 4:30 PM
                </span>
                <span className="text-mindful-purple font-bold">Verified MD</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          MIDDLE ROW: DAILY INSPIRATION & QUICK MOOD SELECTOR
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Inspiration Card */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-br from-[#FFF3F0] to-[#F5EFFB] border border-white shadow-soft relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-mindful-purple bg-white/70 px-3 py-1 rounded-full border border-white">
              Daily Inspiration
            </span>
            <div className="flex gap-3 pt-2">
              <Quote className="w-8 h-8 text-mindful-purple/40 flex-shrink-0" />
              <blockquote className="text-xl font-serif italic text-mindful-textDark leading-relaxed">
                "It's okay to not be okay. What matters is that you don't give up on yourself."
              </blockquote>
            </div>
          </div>

          <div className="pt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
                alt="Illustration character"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <p className="text-xs font-bold text-mindful-textDark">Mindful Daily Affirmations</p>
                <p className="text-[11px] text-mindful-textMuted">Updated every sunrise</p>
              </div>
            </div>
          </div>
        </div>

        {/* How are you feeling today? Interactive Widget */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-mindful-textDark">How are you feeling today?</h3>
            <p className="text-xs text-mindful-textMuted mt-1">Track your mood in one click and receive personalized wellness insights.</p>
          </div>

          {/* Mood Selector Buttons */}
          <div className="grid grid-cols-5 gap-2 sm:gap-4 my-4">
            {moodOptions.map((option) => {
              const isSelected = selectedQuickMood === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedQuickMood(option.id)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? `${option.color} border-2 scale-105 shadow-sm`
                      : 'bg-mindful-bg border-gray-100 hover:bg-white text-gray-500'
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-[11px] font-bold">{option.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            {moodLoggedToast ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle className="w-4 h-4" />
                Mood logged successfully! Check your Dashboard.
              </span>
            ) : (
              <span className="text-xs text-mindful-textMuted">
                Selected: <strong className="text-mindful-purple capitalize">{selectedQuickMood}</strong>
              </span>
            )}

            <button
              onClick={handleTrackMood}
              className="px-6 py-2.5 rounded-full bg-mindful-purple text-white text-xs font-bold shadow-soft hover:bg-mindful-purple-dark transition-all"
            >
              Track My Mood
            </button>
          </div>
        </div>

      </section>


      {/* =========================================================================
          SCROLL SHOWCASE 3: Community & Shared Support Sanctuary
          (Utilizing matching artwork: mindful-community.jpg)
          ========================================================================= */}
      <section className="rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft overflow-hidden p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Generated Aesthetic Community Garden Illustration */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-floating group">
            <div className="relative h-[340px] sm:h-[390px] w-full overflow-hidden">
              <img
                src="/images/mindful-community.jpg"
                alt="Supportive community group sharing mindfulness together in a lush garden"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Badges on image */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white text-xs font-bold text-mindful-purple shadow-soft flex items-center gap-2">
                <Users className="w-4 h-4 text-mindful-purple" />
                <span>Safe Peer Support Circles</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/80 shadow-soft text-xs text-mindful-textDark flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  Over 450+ Active Weekly Discussions
                </span>
                <span className="text-mindful-purple font-bold">24/7 Moderated</span>
              </div>
            </div>
          </div>

          {/* Right Column: Trending Discussions & Join Community */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  Shared Healing Sanctuary
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-mindful-textDark mt-2">
                  You are never alone on this journey.
                </h2>
                <p className="text-xs sm:text-sm text-mindful-textMuted mt-1">
                  Connect with kind souls, share coping strategies, and celebrate every small victory.
                </p>
              </div>
              <button
                onClick={() => onNavigate('community')}
                className="text-xs font-bold text-mindful-purple hover:underline hidden sm:block whitespace-nowrap"
              >
                View All Forum →
              </button>
            </div>

            {/* Trending Posts */}
            <div className="space-y-3.5">
              {[
                {
                  title: 'Dealing with anxiety at work',
                  desc: 'How do you pause and breathe when deadlines pile up?',
                  replies: '32 replies',
                  time: '2h ago',
                  tag: 'Anxiety',
                  user: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
                },
                {
                  title: 'Sharing small wins: I went outside today!',
                  desc: "Took a 20-minute mindful walk in the park. Felt peaceful.",
                  replies: '18 replies',
                  time: '5h ago',
                  tag: 'Gratitude',
                  user: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
                },
                {
                  title: 'Evening routine for deep, restorative sleep',
                  desc: 'Herbal lavender tea and 10 minutes of guided breathwork.',
                  replies: '27 replies',
                  time: '1d ago',
                  tag: 'Sleep',
                  user: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
                },
              ].map((post, i) => (
                <div
                  key={i}
                  onClick={() => onNavigate('community')}
                  className="p-3.5 rounded-2xl bg-mindful-bg/70 border border-gray-100 hover:bg-white hover:border-mindful-purple-subtle hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={post.user} alt="Author" className="w-10 h-10 rounded-full object-cover border border-white shadow-xs" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-mindful-textDark">{post.title}</h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600">
                          {post.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-mindful-textMuted mt-0.5">{post.desc}</p>
                      <span className="text-[10px] text-mindful-purple font-semibold">{post.replies} • {post.time}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-mindful-textMuted flex-shrink-0" />
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('community')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-mindful-purple text-white text-xs font-bold shadow-soft hover:bg-mindful-purple-dark transition-all flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Join the Community Discussion
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          NEWSLETTER BANNER: High-Contrast, Rich Purple Gradient with Clear Typography
          ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#4A3E72] via-[#5E4F8F] to-[#7B6DAE] text-white shadow-floating relative overflow-hidden border border-white/20">
        
        {/* Soft Ambient Light Glows */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-mindful-peach/20 blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Let's stay in touch
            </h3>
            <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed max-w-lg">
              Get daily mindfulness tips, guided audio exercises, and expert advice straight to your inbox.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto flex items-center bg-white rounded-full p-1.5 shadow-floating max-w-md border border-white">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-5 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 font-medium focus:outline-none rounded-full bg-transparent"
              required
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#4A3E72] hover:bg-[#382F58] text-white font-bold text-xs sm:text-sm rounded-full transition-all flex items-center gap-1.5 flex-shrink-0 shadow-sm"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

        {subscribedToast && (
          <div className="mt-4 text-center text-xs font-bold bg-white/25 backdrop-blur-md px-5 py-2 rounded-full inline-block text-white border border-white/30 animate-in fade-in">
            ✨ Thank you for subscribing to Mindful insights!
          </div>
        )}
      </section>

    </div>
  );
}
