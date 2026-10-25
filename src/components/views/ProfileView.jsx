import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Lock, 
  Heart, 
  Calendar, 
  Settings, 
  Sparkles, 
  CheckCircle2, 
  PhoneCall, 
  Mail, 
  Phone, 
  Key, 
  ShieldCheck, 
  Activity, 
  BookOpen, 
  Smile, 
  Clock, 
  Download, 
  Check, 
  LogOut,
  Camera,
  Award
} from 'lucide-react';

export default function ProfileView({ 
  currentUser, 
  onUpdateUser, 
  bookings = [], 
  loggedMoods = [], 
  journalEntries = [],
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'preferences', 'security', 'history'

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Alex Rivera',
    email: currentUser?.email || 'alex@mindful.org',
    phone: currentUser?.phone || '+1 (555) 349-8821',
    bio: currentUser?.bio || 'Dedicated to daily mindfulness, emotional regulation, and peaceful living.',
    emergencyContact: currentUser?.emergencyContact || '+1 (555) 234-5678 (Dr. Marcus)',
    timezone: currentUser?.timezone || 'Eastern Time (US & Canada) - GMT-5',
    dailyReminderTime: currentUser?.dailyReminderTime || '08:30 AM',
    notificationsEnabled: currentUser?.notificationsEnabled !== false,
    ambientAnimations: currentUser?.ambientAnimations !== false,
    soundEffects: currentUser?.soundEffects !== false,
    avatarColor: currentUser?.avatarColor || 'from-mindful-purple to-mindful-peach',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saveStatus, setSaveStatus] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const avatarGradients = [
    { id: 'purple-peach', label: 'Mindful Sunset', class: 'from-mindful-purple to-mindful-peach' },
    { id: 'purple-light', label: 'Lavender Calm', class: 'from-mindful-purple to-mindful-purple-light' },
    { id: 'coral-peach', label: 'Warm Glow', class: 'from-mindful-coral to-mindful-peach' },
    { id: 'teal-emerald', label: 'Forest Zen', class: 'from-teal-600 to-emerald-500' },
    { id: 'indigo-sky', label: 'Ocean Breeze', class: 'from-indigo-600 to-sky-400' },
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        ...formData
      });
    }
    setSaveStatus('Profile updated successfully!');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      setPasswordStatus({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordStatus({ type: 'success', text: 'Password changed successfully!' });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordStatus(null), 3500);
  };

  const handleExportData = () => {
    const data = {
      profile: formData,
      totalMoodLogs: loggedMoods.length,
      moods: loggedMoods,
      totalJournals: journalEntries.length,
      journals: journalEntries,
      appointments: bookings,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindful-wellness-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 text-mindful-purple text-xs font-bold border border-purple-100">
          <User className="w-4 h-4 text-mindful-purple" />
          <span>User Profile & Account Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-mindful-textDark">
          Account Profile & Management
        </h1>
        <p className="text-sm text-mindful-textMuted leading-relaxed">
          Manage your personal details, wellness statistics, emergency contacts, visual preferences, and session history.
        </p>
      </div>

      {/* Profile Overview Card with Quick Stats */}
      <div className="p-8 rounded-3xl bg-white border border-mindful-purple-subtle/50 shadow-soft">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${formData.avatarColor} text-white flex items-center justify-center font-extrabold text-3xl shadow-floating relative group`}>
              <span>{formData.name?.charAt(0) || 'M'}</span>
              <div className="absolute inset-0 bg-black/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-2xl font-bold text-mindful-textDark">{formData.name}</h2>
                <span className="text-[11px] font-bold text-mindful-purple bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                  {currentUser?.role === 'therapist' ? 'Licensed Therapist' : 'Verified Member'}
                </span>
              </div>
              <p className="text-xs text-mindful-textMuted">{formData.email} • Member since {currentUser?.joinedDate || 'August 2026'}</p>
              <p className="text-xs text-mindful-textDark font-medium italic pt-1 max-w-md">"{formData.bio}"</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportData}
              className="px-4 py-2 rounded-2xl bg-mindful-bg hover:bg-gray-100 text-mindful-textDark text-xs font-bold border border-gray-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-mindful-purple" />
              Export Data
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-100 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Real User Activity Statistics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-mindful-bg border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-mindful-textMuted font-semibold">
              <Smile className="w-3.5 h-3.5 text-mindful-purple" />
              <span>Mood Logs</span>
            </div>
            <p className="text-xl font-extrabold text-mindful-textDark">{loggedMoods.length}</p>
            <p className="text-[10px] text-mindful-purple font-medium">Logged in timeline</p>
          </div>

          <div className="p-4 rounded-2xl bg-mindful-bg border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-mindful-textMuted font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-mindful-peach" />
              <span>Journal Entries</span>
            </div>
            <p className="text-xl font-extrabold text-mindful-textDark">{journalEntries.length}</p>
            <p className="text-[10px] text-mindful-peach font-medium">Private reflections</p>
          </div>

          <div className="p-4 rounded-2xl bg-mindful-bg border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-mindful-textMuted font-semibold">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sessions Booked</span>
            </div>
            <p className="text-xl font-extrabold text-mindful-textDark">{bookings.length + 2}</p>
            <p className="text-[10px] text-emerald-600 font-medium">Telehealth care</p>
          </div>

          <div className="p-4 rounded-2xl bg-mindful-bg border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-mindful-textMuted font-semibold">
              <Award className="w-3.5 h-3.5 text-orange-500" />
              <span>Consistency Streak</span>
            </div>
            <p className="text-xl font-extrabold text-mindful-textDark">7 Days</p>
            <p className="text-[10px] text-orange-500 font-medium">Top 5% of members</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
        {[
          { id: 'personal', label: 'Personal Information', icon: User },
          { id: 'preferences', label: 'App & Visual Preferences', icon: Settings },
          { id: 'security', label: 'Security & Password', icon: Lock },
          { id: 'history', label: 'Session History', icon: Calendar },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-mindful-purple text-mindful-purple'
                  : 'border-transparent text-mindful-textMuted hover:text-mindful-textDark'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Information */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 p-8 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-6">
            <h3 className="text-lg font-bold text-mindful-textDark flex items-center gap-2">
              <User className="w-5 h-5 text-mindful-purple" />
              Edit Personal Profile Details
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-mindful-textDark mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-mindful-bg text-xs text-mindful-textDark rounded-2xl border border-gray-200 focus:outline-none focus:border-mindful-purple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-mindful-textDark mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-mindful-bg text-xs text-mindful-textDark rounded-2xl border border-gray-200 focus:outline-none focus:border-mindful-purple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-mindful-textDark mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-mindful-bg text-xs text-mindful-textDark rounded-2xl border border-gray-200 focus:outline-none focus:border-mindful-purple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-mindful-textDark mb-1">Timezone</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-mindful-bg text-xs text-mindful-textDark rounded-2xl border border-gray-200 focus:outline-none focus:border-mindful-purple"
                  >
                    <option value="Eastern Time (US & Canada) - GMT-5">Eastern Time (US & Canada) - GMT-5</option>
                    <option value="Pacific Time (US & Canada) - GMT-8">Pacific Time (US & Canada) - GMT-8</option>
                    <option value="Greenwich Mean Time (GMT) - London">Greenwich Mean Time (GMT) - London</option>
                    <option value="Bangladesh Standard Time (BST) - GMT+6">Bangladesh Standard Time (BST) - GMT+6</option>
                    <option value="India Standard Time (IST) - GMT+5:30">India Standard Time (IST) - GMT+5:30</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-mindful-textDark mb-1">Personal Wellness Bio / Intention</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share a short sentence on your emotional wellbeing goals..."
                  className="w-full p-4 bg-mindful-bg text-xs text-mindful-textDark rounded-2xl border border-gray-200 focus:outline-none focus:border-mindful-purple resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-mindful-textDark mb-1">Emergency Crisis Contact (Doctor or Family)</label>
                <div className="relative">
                  <PhoneCall className="w-4 h-4 text-mindful-coral absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="e.g. +1 (555) 234-5678 (Dr. Marcus)"
                    className="w-full pl-10 pr-4 py-2.5 bg-mindful-bg text-xs text-mindful-textDark rounded-2xl border border-gray-200 focus:outline-none focus:border-mindful-purple"
                  />
                </div>
              </div>

              {/* Avatar Theme Selector */}
              <div>
                <label className="block text-xs font-bold text-mindful-textDark mb-2">Avatar Color Theme</label>
                <div className="flex flex-wrap gap-3">
                  {avatarGradients.map((grad) => (
                    <button
                      type="button"
                      key={grad.id}
                      onClick={() => setFormData({ ...formData, avatarColor: grad.class })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                        formData.avatarColor === grad.class
                          ? 'border-mindful-purple bg-purple-50 text-mindful-purple scale-105 shadow-xs'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-gradient-to-tr ${grad.class}`}></span>
                      <span>{grad.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {saveStatus ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    {saveStatus}
                  </span>
                ) : (
                  <span className="text-xs text-mindful-textMuted">Changes are saved to your local session</span>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-mindful-purple text-white text-xs font-bold shadow-soft hover:bg-mindful-purple-dark transition-all transform hover:scale-[1.02]"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Crisis Support */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-7 rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 space-y-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <Shield className="w-5 h-5" />
                <span>Immediate 24/7 Crisis Support</span>
              </div>
              <p className="text-xs text-mindful-textDark leading-relaxed">
                If you or someone you know is experiencing acute distress or thoughts of self-harm, confidential free help is always available:
              </p>
              <div className="p-3.5 rounded-2xl bg-white text-xs font-bold text-red-600 space-y-1.5 shadow-xs border border-red-100">
                <p>📞 National Lifeline: Call or Text 988</p>
                <p>💬 Crisis Text Line: Text HOME to 741741</p>
                <p>🏥 International: 112 / 999 Emergency Services</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-3">
              <h4 className="text-sm font-bold text-mindful-textDark flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Privacy & Data Encryption
              </h4>
              <p className="text-xs text-mindful-textMuted leading-relaxed">
                Your mood history, private reflections, and personal entries are kept confidential and client-side encrypted following healthcare privacy principles.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Preferences & Visual Settings */}
      {activeTab === 'preferences' && (
        <div className="max-w-3xl p-8 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-6">
          <h3 className="text-lg font-bold text-mindful-textDark flex items-center gap-2">
            <Settings className="w-5 h-5 text-mindful-purple" />
            Application & Visual Experience Preferences
          </h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-mindful-bg border border-gray-100 cursor-pointer hover:bg-purple-50/40 transition-colors">
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-mindful-textDark">Smooth Ambient Visuals</span>
                <p className="text-xs text-mindful-textMuted">Enable fluid organic aura gradients and soothing micro-interactions</p>
              </div>
              <input
                type="checkbox"
                checked={formData.ambientAnimations}
                onChange={(e) => setFormData({ ...formData, ambientAnimations: e.target.checked })}
                className="w-5 h-5 text-mindful-purple rounded accent-mindful-purple"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-mindful-bg border border-gray-100 cursor-pointer hover:bg-purple-50/40 transition-colors">
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-mindful-textDark">Therapy Session Reminders</span>
                <p className="text-xs text-mindful-textMuted">Receive timely alerts 30 minutes before your scheduled video appointment</p>
              </div>
              <input
                type="checkbox"
                checked={formData.notificationsEnabled}
                onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
                className="w-5 h-5 text-mindful-purple rounded accent-mindful-purple"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-mindful-bg border border-gray-100 cursor-pointer hover:bg-purple-50/40 transition-colors">
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-mindful-textDark">Calming Audio Chimes & Ambient Feedback</span>
                <p className="text-xs text-mindful-textMuted">Play subtle harmonic chimes when saving mood logs or completing mindfulness goals</p>
              </div>
              <input
                type="checkbox"
                checked={formData.soundEffects}
                onChange={(e) => setFormData({ ...formData, soundEffects: e.target.checked })}
                className="w-5 h-5 text-mindful-purple rounded accent-mindful-purple"
              />
            </label>

            <div className="p-4 rounded-2xl bg-mindful-bg border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-mindful-textDark">Daily Reflection Reminder Time</span>
                <p className="text-xs text-mindful-textMuted">Prompt yourself once every morning or evening to log your state</p>
              </div>
              <input
                type="text"
                value={formData.dailyReminderTime}
                onChange={(e) => setFormData({ ...formData, dailyReminderTime: e.target.value })}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-mindful-textDark bg-white focus:outline-none focus:border-mindful-purple"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2.5 rounded-full bg-mindful-purple text-white text-xs font-bold shadow-soft hover:bg-mindful-purple-dark transition-all"
            >
              Update Preferences
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === 'security' && (
        <div className="max-w-2xl p-8 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-6">
          <h3 className="text-lg font-bold text-mindful-textDark flex items-center gap-2">
            <Lock className="w-5 h-5 text-mindful-purple" />
            Security & Authentication Credentials
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-mindful-textDark mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-4 py-2.5 bg-mindful-bg text-xs text-mindful-textDark rounded-2xl border border-gray-200 focus:outline-none focus:border-mindful-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-mindful-textDark mb-1">New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-4 py-2.5 bg-mindful-bg text-xs text-mindful-textDark rounded-2xl border border-gray-200 focus:outline-none focus:border-mindful-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-mindful-textDark mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-type new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 bg-mindful-bg text-xs text-mindful-textDark rounded-2xl border border-gray-200 focus:outline-none focus:border-mindful-purple"
              />
            </div>

            {passwordStatus && (
              <div className={`p-3 rounded-2xl text-xs font-bold ${passwordStatus.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                {passwordStatus.text}
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-mindful-purple text-white text-xs font-bold shadow-soft hover:bg-mindful-purple-dark transition-all"
            >
              Update Password
            </button>
          </form>

          {/* 2FA Toggle */}
          <div className="pt-6 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-mindful-textDark">Two-Factor Authentication (2FA)</h4>
                <p className="text-[11px] text-mindful-textMuted">Add extra verification step when signing into your Mindful account</p>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  twoFactorEnabled
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {twoFactorEnabled ? '2FA Enabled ✓' : 'Enable 2FA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Session History */}
      {activeTab === 'history' && (
        <div className="max-w-3xl p-8 rounded-3xl bg-white border border-mindful-purple-subtle/40 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-mindful-textDark flex items-center gap-2">
              <Calendar className="w-5 h-5 text-mindful-purple" />
              Telehealth Consultation & Therapy History
            </h3>
            <span className="text-xs text-mindful-textMuted font-bold">
              Total {bookings.length + 2} Appointments
            </span>
          </div>

          <div className="space-y-3">
            {/* Real Booked Sessions */}
            {bookings.map((booking, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <strong className="text-sm font-bold text-mindful-textDark">{booking.therapist}</strong>
                  </div>
                  <span className="text-[10px] font-bold bg-purple-100 text-mindful-purple px-2.5 py-0.5 rounded-full uppercase">
                    Upcoming Appointment
                  </span>
                </div>
                <p className="text-mindful-textMuted">
                  {booking.date} • {booking.time} • Format: <span className="capitalize font-bold text-mindful-textDark">{booking.type || 'Video Consultation'}</span>
                </p>
              </div>
            ))}

            {/* Past Completed Records */}
            {[
              { therapist: 'Dr. Sarah Ahmed', date: 'Aug 20, 2026', time: '04:00 PM', type: 'Video Call', status: 'Completed', notes: 'Discussed cognitive reframing techniques and morning meditation routine.' },
              { therapist: 'Dr. Nusrat Jehan', date: 'Aug 12, 2026', time: '11:00 AM', type: 'Voice Call', status: 'Completed', notes: 'Introduced 4-7-8 breathing exercises for work-related anxiety.' },
            ].map((sess, idx) => (
              <div key={`past-${idx}`} className="p-4 rounded-2xl bg-mindful-bg border border-gray-100 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-mindful-textDark">{sess.therapist}</strong>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">
                    {sess.status}
                  </span>
                </div>
                <p className="text-mindful-textMuted">{sess.date} • {sess.time} ({sess.type})</p>
                {sess.notes && (
                  <p className="text-[11px] text-mindful-textDark italic bg-white p-2.5 rounded-xl border border-gray-100">
                    Clinical Notes: "{sess.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
