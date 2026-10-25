import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import api from './services/api';

// Views
import HomeView from './components/views/HomeView';
import AuthModal from './components/views/AuthModal';
import AuthRequiredView from './components/views/AuthRequiredView';
import DashboardView from './components/views/DashboardView';
import MoodTrackerView from './components/views/MoodTrackerView';
import JournalView from './components/views/JournalView';
import CommunityView from './components/views/CommunityView';
import TherapistsView from './components/views/TherapistsView';
import BookingView from './components/views/BookingView';
import ProfileView from './components/views/ProfileView';

// Default Realistic Initial Datasets
const DEFAULT_USER = {
  name: 'Alex Rivera',
  email: 'alex@mindful.org',
  role: 'patient',
  phone: '+1 (555) 349-8821',
  bio: 'Dedicated to daily mindfulness, emotional regulation, and peaceful living.',
  emergencyContact: '+1 (555) 234-5678 (Dr. Marcus)',
  timezone: 'Eastern Time (US & Canada) - GMT-5',
  dailyReminderTime: '08:30 AM',
  notificationsEnabled: true,
  ambientAnimations: true,
  soundEffects: true,
  avatarColor: 'from-mindful-purple to-mindful-peach',
  joinedDate: 'August 2026'
};

const DEFAULT_MOODS = [
  {
    id: 1,
    mood: 'great',
    score: 5,
    emotions: ['Inspired', 'Calm', 'Joyful'],
    activities: ['Meditation', 'Nature Walk'],
    notes: 'Had a wonderful morning reflection and peaceful walk in the park.',
    timestamp: '09:30 AM',
    date: 'Today',
    fullDate: new Date().toISOString()
  },
  {
    id: 2,
    mood: 'good',
    score: 4,
    emotions: ['Hopeful', 'Focused'],
    activities: ['Work', 'Reading'],
    notes: 'Productive work session and finished a chapter on emotional agility.',
    timestamp: '03:15 PM',
    date: 'Yesterday',
    fullDate: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    mood: 'great',
    score: 5,
    emotions: ['Grateful', 'Peaceful'],
    activities: ['Family', 'Meditation'],
    notes: 'Lovely evening with family and a calming 15-minute grounding exercise.',
    timestamp: '08:00 PM',
    date: 'Aug 26',
    fullDate: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 4,
    mood: 'okay',
    score: 3,
    emotions: ['Tired', 'Calm'],
    activities: ['Work', 'Sleep Rest'],
    notes: 'Busy project sprint, feeling slightly fatigued but mentally grounded.',
    timestamp: '06:45 PM',
    date: 'Aug 25',
    fullDate: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 5,
    mood: 'good',
    score: 4,
    emotions: ['Content', 'Inspired'],
    activities: ['Exercise', 'Music'],
    notes: 'Jogging by the lake really refreshed my mind and cleared mental clutter.',
    timestamp: '07:30 AM',
    date: 'Aug 24',
    fullDate: new Date(Date.now() - 345600000).toISOString()
  }
];

const DEFAULT_JOURNALS = [
  {
    id: 1,
    title: 'Finding Joy in Small Moments',
    content: 'Today I took 15 minutes during lunch to sit outside and listen to the birds. It brought such a profound sense of grounding and clarity. Sometimes we rush through our days searching for monumental milestones, when true contentment is quietly waiting in the ordinary gaps between our to-dos.',
    category: 'Gratitude',
    associatedMood: 'Grateful',
    promptUsed: 'What made you smile or feel deeply peaceful today?',
    date: 'Aug 27, 2026',
    readTime: '2 min read',
    wordCount: 54,
    isFavorite: true
  },
  {
    id: 2,
    title: 'Reflections after Therapy with Dr. Sarah',
    content: 'Dr. Sarah reminded me that anxiety is just a temporary emotional weather pattern. I do not have to identify with every thought that arises. When I practice observing thoughts like floating clouds rather than internal commands, my nervous system calms down remarkably.',
    category: 'Therapy Reflections',
    associatedMood: 'Reflective',
    promptUsed: 'What is one heavy thought you can safely let go of right now?',
    date: 'Aug 20, 2026',
    readTime: '2 min read',
    wordCount: 48,
    isFavorite: true
  },
  {
    id: 3,
    title: 'Reclaiming My Morning Peace',
    content: 'Eliminating social media notifications for the first hour of waking up has been transformative. My morning now begins with hydration, gentle breathing, and intention setting rather than comparison and cortisol spikes.',
    category: 'Self-Growth',
    associatedMood: 'Peaceful',
    promptUsed: 'Describe a moment today where you felt proud of your emotional growth.',
    date: 'Aug 15, 2026',
    readTime: '1 min read',
    wordCount: 36,
    isFavorite: false
  }
];

const DEFAULT_GOALS = [
  { id: 1, label: 'Morning Meditation (10 mins)', done: true, category: 'Mindfulness' },
  { id: 2, label: 'Log Daily Mood in Mindful App', done: true, category: 'Tracking' },
  { id: 3, label: 'Drink 2 Liters of Fresh Water', done: true, category: 'Wellness' },
  { id: 4, label: 'Evening Gratitude Reflection in Journal', done: false, category: 'Reflection' },
  { id: 5, label: '20-Minute Nature Walk without Phone', done: false, category: 'Movement' },
];

const DEFAULT_BOOKINGS = [
  {
    therapist: 'Dr. Sarah Ahmed',
    role: 'Clinical Psychologist',
    date: 'Today, Aug 28',
    time: '4:00 PM',
    type: 'Video Consultation',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=160'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  
  // Initialize state with localStorage persistence
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mindful_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [loggedMoods, setLoggedMoods] = useState(() => {
    const saved = localStorage.getItem('mindful_moods');
    return saved ? JSON.parse(saved) : DEFAULT_MOODS;
  });

  const [journalEntries, setJournalEntries] = useState(() => {
    const saved = localStorage.getItem('mindful_journals');
    return saved ? JSON.parse(saved) : DEFAULT_JOURNALS;
  });

  const [selfCareGoals, setSelfCareGoals] = useState(() => {
    const saved = localStorage.getItem('mindful_goals');
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('mindful_bookings');
    return saved ? JSON.parse(saved) : DEFAULT_BOOKINGS;
  });

  const [selectedTherapist, setSelectedTherapist] = useState(null);

  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 1,
      title: 'Dealing with anxiety at work - How do you manage it?',
      category: 'Anxiety & Stress',
      content: 'When deadline pressure builds up, I sometimes feel overwhelmed. What small grounding techniques help you reset during the workday?',
      author: 'Mindful Explorer',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      upvotes: 32,
      repliesCount: 14,
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'Sharing small wins - Let\'s celebrate together!',
      category: 'Daily Wins',
      content: 'I managed to stick to my 10-minute morning meditation for 7 straight days! Huge milestone for me.',
      author: 'PeacefulMind99',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
      upvotes: 45,
      repliesCount: 18,
      time: '5 hours ago'
    }
  ]);

  // Persist state updates to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mindful_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mindful_moods', JSON.stringify(loggedMoods));
  }, [loggedMoods]);

  useEffect(() => {
    localStorage.setItem('mindful_journals', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('mindful_goals', JSON.stringify(selfCareGoals));
  }, [selfCareGoals]);

  useEffect(() => {
    localStorage.setItem('mindful_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Actions
  const handleOpenAuth = (mode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mindful_user');
    setActiveTab('home');
  };

  const handleUpdateProfile = async (updatedUser) => {
    setCurrentUser(updatedUser);
    await api.auth.updateProfile(updatedUser);
  };

  const handleQuickMoodLog = async (mood) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    const moodScoreMap = { 'great': 5, 'good': 4, 'okay': 3, 'bad': 2, 'very-bad': 1 };
    const newLog = {
      id: Date.now(),
      mood: mood,
      score: moodScoreMap[mood] || 4,
      emotions: ['Peaceful', 'Grounded'],
      activities: ['Quick Check-in'],
      notes: `Quick mood entry logged from Home view (${mood}).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      fullDate: new Date().toISOString()
    };
    setLoggedMoods([newLog, ...loggedMoods]);
    await api.moods.add(newLog);
  };

  const handleAddMood = async (entry) => {
    setLoggedMoods([entry, ...loggedMoods]);
    await api.moods.add(entry);
  };

  const handleDeleteMood = async (id) => {
    setLoggedMoods(loggedMoods.filter(m => m.id !== id));
    await api.moods.delete(id);
  };

  const handleAddJournal = async (entry) => {
    setJournalEntries([entry, ...journalEntries]);
    await api.journals.add(entry);
  };

  const handleUpdateJournal = async (id, updatedEntry) => {
    setJournalEntries(journalEntries.map(e => e.id === id ? { ...e, ...updatedEntry } : e));
    await api.journals.update(id, updatedEntry);
  };

  const handleDeleteJournal = async (id) => {
    setJournalEntries(journalEntries.filter(e => e.id !== id));
    await api.journals.delete(id);
  };

  const handleToggleFavoriteJournal = async (id) => {
    setJournalEntries(journalEntries.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e));
    await api.journals.toggleFavorite(id);
  };

  const handleToggleGoal = async (id) => {
    setSelfCareGoals(selfCareGoals.map(g => g.id === id ? { ...g, done: !g.done } : g));
    await api.goals.toggle(id);
  };

  const handleAddGoal = async (goal) => {
    setSelfCareGoals([...selfCareGoals, goal]);
    await api.goals.create(goal);
  };

  const handleAddBooking = async (booking) => {
    setBookings([booking, ...bookings]);
    setActiveTab('dashboard');
    await api.bookings.create(booking);
  };

  const handleAddCommunityPost = (post) => {
    setCommunityPosts([post, ...communityPosts]);
  };

  const handleUpvotePost = (postId) => {
    setCommunityPosts(communityPosts.map(p => 
      p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p
    ));
  };

  const handleSelectTherapistForBooking = (therapist) => {
    setSelectedTherapist(therapist);
    if (!currentUser) {
      handleOpenAuth('login');
    } else {
      setActiveTab('booking');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col mindful-mesh-bg relative overflow-x-hidden selection:bg-purple-200 selection:text-mindful-purple">
      
      {/* Decorative Soothing Floating Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Lavender Orb top-left */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-200/50 to-indigo-100/40 blur-[130px] animate-ambient-slow"></div>
        
        {/* Warm Peach Glow top-right */}
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-orange-100/60 to-rose-100/40 blur-[140px] animate-ambient-reverse"></div>
        
        {/* Zen Turquoise Mist bottom-center */}
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-teal-100/40 to-sky-100/40 blur-[120px] animate-ambient-slow"></div>

        {/* Subtle Zen Dot Matrix Overlay */}
        <div className="absolute inset-0 zen-dot-pattern opacity-30"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (!currentUser && (tab === 'dashboard' || tab === 'profile' || tab === 'journal' || tab === 'mood' || tab === 'booking')) {
              handleOpenAuth('login');
            }
            setActiveTab(tab);
          }}
          onOpenAuth={handleOpenAuth}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Main View Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {activeTab === 'home' && (
          <HomeView
            onNavigate={(tab) => {
              if (!currentUser && (tab === 'dashboard' || tab === 'profile' || tab === 'journal' || tab === 'mood' || tab === 'booking')) {
                handleOpenAuth('login');
              }
              setActiveTab(tab);
            }}
            onQuickMoodLog={handleQuickMoodLog}
            onQuickJournalSave={handleAddJournal}
            loggedMoods={loggedMoods}
          />
        )}

        {activeTab === 'dashboard' && (
          currentUser ? (
            <DashboardView
              currentUser={currentUser}
              onNavigate={setActiveTab}
              loggedMoods={loggedMoods}
              journalEntries={journalEntries}
              bookings={bookings}
              selfCareGoals={selfCareGoals}
              onToggleGoal={handleToggleGoal}
              onAddGoal={handleAddGoal}
              onQuickJournalSave={handleAddJournal}
            />
          ) : (
            <AuthRequiredView onOpenAuth={handleOpenAuth} featureName="Personalized Dashboard" />
          )
        )}

        {activeTab === 'mood' && (
          currentUser ? (
            <MoodTrackerView
              loggedMoods={loggedMoods}
              onAddMood={handleAddMood}
              onDeleteMood={handleDeleteMood}
            />
          ) : (
            <AuthRequiredView onOpenAuth={handleOpenAuth} featureName="Daily Mood Tracker & Emotional Aura" />
          )
        )}

        {activeTab === 'journal' && (
          currentUser ? (
            <JournalView
              entries={journalEntries}
              onAddEntry={handleAddJournal}
              onUpdateEntry={handleUpdateJournal}
              onDeleteEntry={handleDeleteJournal}
              onToggleFavorite={handleToggleFavoriteJournal}
            />
          ) : (
            <AuthRequiredView onOpenAuth={handleOpenAuth} featureName="Private Reflections Journal" />
          )
        )}

        {activeTab === 'community' && (
          <CommunityView
            posts={communityPosts}
            onAddPost={(post) => {
              if (!currentUser) {
                handleOpenAuth('login');
              } else {
                handleAddCommunityPost(post);
              }
            }}
            onUpvotePost={handleUpvotePost}
          />
        )}

        {activeTab === 'therapists' && (
          <TherapistsView
            onSelectTherapistForBooking={handleSelectTherapistForBooking}
          />
        )}

        {activeTab === 'booking' && (
          currentUser ? (
            <BookingView
              selectedTherapist={selectedTherapist}
              onBookingConfirmed={(booking) => {
                handleAddBooking({
                  therapist: booking.therapist,
                  date: booking.date,
                  time: booking.time,
                  type: booking.type,
                  img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=160'
                });
              }}
            />
          ) : (
            <AuthRequiredView onOpenAuth={handleOpenAuth} featureName="Appointment Booking" />
          )
        )}

        {activeTab === 'profile' && (
          currentUser ? (
            <ProfileView
              currentUser={currentUser}
              onUpdateUser={handleUpdateProfile}
              bookings={bookings}
              loggedMoods={loggedMoods}
              journalEntries={journalEntries}
              onLogout={handleLogout}
            />
          ) : (
            <AuthRequiredView onOpenAuth={handleOpenAuth} featureName="Account Profile" />
          )
        )}

      </main>

        {/* Global Footer */}
        <Footer onNavigate={setActiveTab} />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
}
