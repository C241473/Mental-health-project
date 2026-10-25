import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Calendar,
  Database,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  UserPlus,
  RefreshCw,
  Search,
  Filter,
  AlertCircle,
  Check,
  Activity,
  Heart,
  BookOpen,
  Lock,
  Unlock,
  KeyRound,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';

// Defined Admin Credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@mindful.org',
  password: 'admin123'
};

export default function AdminView({ onNavigate }) {
  // Check if admin is currently unlocked in this browser session
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('mindful_admin_unlocked') === 'true';
  });

  // Lock Screen Input states
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Admin Panel states
  const [activeAdminTab, setActiveAdminTab] = useState('overview'); // 'overview' | 'users' | 'bookings' | 'database'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Filters & Search
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'patient',
    specialty: 'Clinical Psychology',
    phone: '',
    password: 'password123'
  });

  // Fetch all admin data directly from MongoDB backend once unlocked
  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, bookingsRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getUsers(),
        api.admin.getBookings()
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }
      if (usersRes.success && Array.isArray(usersRes.data)) {
        setUsers(usersRes.data);
      }
      if (bookingsRes.success && Array.isArray(bookingsRes.data)) {
        setBookings(bookingsRes.data);
      }
    } catch (err) {
      showToast('error', 'Failed to fetch MongoDB admin data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchAllAdminData();
    }
  }, [isUnlocked]);

  const showToast = (type, text) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4500);
  };

  // 1. Lock Screen Authenticator
  const handleUnlockSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsAuthenticating(true);

    const emailTrim = inputEmail.trim().toLowerCase();
    const passTrim = inputPassword.trim();

    try {
      // Authenticate via MongoDB API or Admin Master Credentials
      let success = false;
      const apiRes = await api.admin.login(emailTrim, passTrim);

      if (apiRes.success && apiRes.data?.token) {
        localStorage.setItem('token', apiRes.data.token);
        success = true;
      } else if (emailTrim === ADMIN_CREDENTIALS.email && passTrim === ADMIN_CREDENTIALS.password) {
        success = true;
      }

      if (success) {
        setIsUnlocked(true);
        sessionStorage.setItem('mindful_admin_unlocked', 'true');
        sessionStorage.setItem('mindful_admin_email', emailTrim);
        showToast('success', 'Admin Panel Unlocked Successfully!');
      } else {
        setLoginError(apiRes.error || 'Invalid Admin Email or Password. Access Denied.');
      }
    } catch (err) {
      if (emailTrim === ADMIN_CREDENTIALS.email && passTrim === ADMIN_CREDENTIALS.password) {
        setIsUnlocked(true);
        sessionStorage.setItem('mindful_admin_unlocked', 'true');
      } else {
        setLoginError('Authentication Error: ' + err.message);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Lock Admin Panel
  const handleLockPanel = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('mindful_admin_unlocked');
    sessionStorage.removeItem('mindful_admin_email');
    setInputPassword('');
    setLoginError('');
  };

  // Fill default credentials helper
  const handleQuickFill = () => {
    setInputEmail(ADMIN_CREDENTIALS.email);
    setInputPassword(ADMIN_CREDENTIALS.password);
    setLoginError('');
  };

  // 2. Role Change Handler - Updates MongoDB in real-time
  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(true);
    try {
      const specialty = newRole === 'therapist' ? 'Clinical Psychology' : '';
      const res = await api.admin.updateUserRole(userId, newRole, specialty);
      if (res.success) {
        showToast('success', `MongoDB Updated: User role changed to "${newRole}"`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole, specialty } : u))
        );
        const updatedStats = await api.admin.getStats();
        if (updatedStats.success) setStats(updatedStats.data);
      } else {
        showToast('error', res.error || 'Failed to update role in MongoDB');
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 3. User Deletion Handler - Deletes from MongoDB
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}" from MongoDB database?`)) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.admin.deleteUser(userId);
      if (res.success) {
        showToast('success', `MongoDB Updated: User "${userName}" successfully removed.`);
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        const updatedStats = await api.admin.getStats();
        if (updatedStats.success) setStats(updatedStats.data);
      } else {
        showToast('error', res.error || 'Failed to delete user');
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 4. User Creation Handler - Inserts into MongoDB
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      showToast('error', 'Please provide name and email');
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.admin.createUser(newUser);
      if (res.success) {
        showToast('success', `MongoDB Updated: New user "${newUser.name}" saved!`);
        setShowAddUserModal(false);
        setNewUser({
          name: '',
          email: '',
          role: 'patient',
          specialty: 'Clinical Psychology',
          phone: '',
          password: 'password123'
        });
        fetchAllAdminData();
      } else {
        showToast('error', res.error || 'Failed to create user');
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Booking Status Change Handler - Updates MongoDB
  const handleBookingStatusChange = async (bookingId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await api.admin.updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        showToast('success', `MongoDB Updated: Appointment status changed to "${newStatus}"`);
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
        const updatedStats = await api.admin.getStats();
        if (updatedStats.success) setStats(updatedStats.data);
      } else {
        showToast('error', res.error || 'Failed to update booking');
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 6. Booking Deletion Handler - Deletes from MongoDB
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking record from MongoDB?')) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.admin.deleteBooking(bookingId);
      if (res.success) {
        showToast('success', 'MongoDB Updated: Booking removed successfully');
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
        const updatedStats = await api.admin.getStats();
        if (updatedStats.success) setStats(updatedStats.data);
      } else {
        showToast('error', res.error || 'Failed to delete booking');
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.specialty && u.specialty.toLowerCase().includes(userSearch.toLowerCase()));
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Bookings List
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.therapistName && b.therapistName.toLowerCase().includes(bookingSearch.toLowerCase())) ||
      (b.notes && b.notes.toLowerCase().includes(bookingSearch.toLowerCase())) ||
      (b.type && b.type.toLowerCase().includes(bookingSearch.toLowerCase()));
    const matchesStatus =
      bookingStatusFilter === 'all' ||
      (b.status && b.status.toLowerCase() === bookingStatusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  // =========================================================================
  // IF LOCKED: RENDER ADMIN LOCK / LOGIN SCREEN
  // =========================================================================
  if (!isUnlocked) {
    return (
      <div className="min-h-[85vh] bg-[#FAF8F5] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-mindful-purple-subtle/50 shadow-soft animate-in fade-in zoom-in-95 duration-200">

          {/* Security Icon */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-mindful-purple to-mindful-purple-light flex items-center justify-center text-white shadow-soft mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-mindful-textDark tracking-tight">
              Admin Portal Locked 🔒
            </h2>
            <p className="text-xs sm:text-sm text-mindful-textMuted mt-1.5 leading-relaxed">
              Security verification required. Enter Admin Email & Password to unlock access to the MongoDB Control Center.
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-mindful-textDark mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-mindful-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="admin@mindful.org"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-mindful-bg border border-mindful-purple-subtle/40 focus:outline-none focus:border-mindful-purple text-mindful-textDark transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-mindful-textDark mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-mindful-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-mindful-bg border border-mindful-purple-subtle/40 focus:outline-none focus:border-mindful-purple text-mindful-textDark transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mindful-textMuted hover:text-mindful-textDark"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-xl bg-mindful-purple text-white text-xs sm:text-sm font-bold hover:bg-mindful-purple-dark shadow-soft hover:shadow-floating transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Auto-fill helper box */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={handleQuickFill}
              className="w-full p-3 rounded-2xl bg-purple-50 hover:bg-purple-100/70 border border-purple-200/60 transition-colors text-left flex items-center justify-between group"
            >
              <div>
                <p className="text-[11px] font-bold text-mindful-purple">
                  Admin Credentials:
                </p>
                <p className="text-[11px] font-mono text-mindful-textDark mt-0.5">
                  admin@mindful.org / admin123
                </p>
              </div>
              <span className="text-[10px] font-bold text-mindful-purple group-hover:underline">
                Click to Auto-fill &rarr;
              </span>
            </button>
          </div>

          {/* Return button */}
          <div className="mt-5 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs font-semibold text-mindful-textMuted hover:text-mindful-purple transition-colors"
            >
              &larr; Back to Mindful Home
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // IF UNLOCKED: RENDER FULL ADMIN PANEL
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Floating Toast Notification */}
        {feedbackMsg && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Top Header & MongoDB Live Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-mindful-purple-subtle/40">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-mindful-purple to-mindful-purple-light flex items-center justify-center text-white shadow-soft">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-bold text-mindful-textDark tracking-tight">
                    Admin Control Center
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    MongoDB Atlas Connected
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-mindful-textMuted mt-0.5">
                  Direct real-time administration for Users, Appointments, and System Telemetry.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchAllAdminData}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-mindful-purple-subtle text-mindful-textDark text-xs font-bold hover:bg-mindful-bg shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Atlas</span>
            </button>

            {/* Lock Panel Button */}
            <button
              onClick={handleLockPanel}
              title="Lock Admin Panel"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 shadow-xs transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Panel</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 rounded-xl bg-mindful-purple text-white text-xs font-bold hover:bg-mindful-purple-dark shadow-soft transition-colors"
            >
              User Portal &rarr;
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-6 pb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: Activity },
            { id: 'users', label: `Users (${users.length})`, icon: Users },
            { id: 'bookings', label: `Appointments (${bookings.length})`, icon: Calendar },
            { id: 'database', label: 'Database Health', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  active
                    ? 'bg-mindful-purple text-white shadow-soft'
                    : 'bg-white text-mindful-textMuted hover:text-mindful-textDark hover:bg-mindful-purple-subtle/30 border border-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            TAB 1: OVERVIEW & KPIS
        ========================================================================= */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Total Registered Users */}
              <div className="p-5 rounded-3xl bg-white border border-mindful-purple-subtle/30 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-mindful-textMuted">
                    Total Users
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-mindful-purple/10 text-mindful-purple flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-mindful-textDark">
                  {stats?.metrics?.totalUsers ?? users.length}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-mindful-textMuted">
                  <span className="font-semibold text-emerald-600">
                    {stats?.metrics?.totalPatients ?? 0} Patients
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-mindful-purple">
                    {stats?.metrics?.totalTherapists ?? 0} Therapists
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-amber-600">
                    {stats?.metrics?.totalAdmins ?? 1} Admins
                  </span>
                </div>
              </div>

              {/* Total Appointments */}
              <div className="p-5 rounded-3xl bg-white border border-mindful-purple-subtle/30 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-mindful-textMuted">
                    Appointments
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-mindful-textDark">
                  {stats?.metrics?.totalBookings ?? bookings.length}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-mindful-textMuted">
                  <span className="font-semibold text-emerald-600">
                    {stats?.metrics?.confirmedBookings ?? 0} Confirmed
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-slate-500">
                    {stats?.metrics?.completedBookings ?? 0} Done
                  </span>
                </div>
              </div>

              {/* Mood Entries Logged */}
              <div className="p-5 rounded-3xl bg-white border border-mindful-purple-subtle/30 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-mindful-textMuted">
                    Mood Logs (Atlas)
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-mindful-textDark">
                  {stats?.metrics?.totalMoods ?? 0}
                </div>
                <p className="text-xs text-mindful-textMuted mt-2">
                  Daily emotional check-ins saved in MongoDB
                </p>
              </div>

              {/* Journal Entries */}
              <div className="p-5 rounded-3xl bg-white border border-mindful-purple-subtle/30 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-mindful-textMuted">
                    Journals (Atlas)
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-mindful-textDark">
                  {stats?.metrics?.totalJournals ?? 0}
                </div>
                <p className="text-xs text-mindful-textMuted mt-2">
                  Reflections & gratitude notes
                </p>
              </div>
            </div>

            {/* Quick Action Tables & Recent Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recent Users Widget */}
              <div className="p-6 rounded-3xl bg-white border border-mindful-purple-subtle/30 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-mindful-textDark flex items-center gap-2">
                    <Users className="w-4 h-4 text-mindful-purple" />
                    <span>Recent Registered Users</span>
                  </h3>
                  <button
                    onClick={() => setActiveAdminTab('users')}
                    className="text-xs font-bold text-mindful-purple hover:underline"
                  >
                    Manage All ({users.length}) &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {users.slice(0, 4).map((u) => (
                    <div
                      key={u._id}
                      className="p-3.5 rounded-2xl bg-mindful-bg flex items-center justify-between gap-3 border border-mindful-purple-subtle/20"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-mindful-purple text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-mindful-textDark truncate">{u.name}</p>
                          <p className="text-[11px] text-mindful-textMuted truncate">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            u.role === 'admin'
                              ? 'bg-rose-100 text-rose-700'
                              : u.role === 'therapist'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Appointments Widget */}
              <div className="p-6 rounded-3xl bg-white border border-mindful-purple-subtle/30 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-mindful-textDark flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <span>Recent Appointments</span>
                  </h3>
                  <button
                    onClick={() => setActiveAdminTab('bookings')}
                    className="text-xs font-bold text-mindful-purple hover:underline"
                  >
                    Manage All ({bookings.length}) &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {bookings.slice(0, 4).map((b) => (
                    <div
                      key={b._id}
                      className="p-3.5 rounded-2xl bg-mindful-bg flex items-center justify-between gap-3 border border-mindful-purple-subtle/20"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-mindful-textDark truncate">
                            {b.therapistName}
                          </p>
                          <p className="text-[11px] text-mindful-textMuted truncate">
                            {b.date} • {b.time}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : b.status === 'Completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {b.status || 'Confirmed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: USER MANAGEMENT (Real-time MongoDB CRUD)
        ========================================================================= */}
        {activeAdminTab === 'users' && (
          <div className="space-y-4">
            {/* Filter & Add User Header */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-mindful-purple-subtle/30 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">

              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-mindful-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name, email, specialty..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-mindful-bg border border-mindful-purple-subtle/40 focus:outline-none focus:border-mindful-purple"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-mindful-textMuted" />
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="text-xs py-2 px-3 rounded-xl bg-mindful-bg border border-mindful-purple-subtle/40 text-mindful-textDark font-medium focus:outline-none focus:border-mindful-purple"
                  >
                    <option value="all">All Roles</option>
                    <option value="patient">Patients</option>
                    <option value="therapist">Therapists</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mindful-purple text-white text-xs font-bold hover:bg-mindful-purple-dark shadow-soft transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add User to MongoDB</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-mindful-purple-subtle/30 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-mindful-bg/60 text-[11px] font-bold text-mindful-textMuted uppercase tracking-wider">
                      <th className="py-3.5 px-4 sm:px-6">User Info</th>
                      <th className="py-3.5 px-4">Contact / Phone</th>
                      <th className="py-3.5 px-4">Current Role (MongoDB)</th>
                      <th className="py-3.5 px-4">Change Role</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-10 text-center text-mindful-textMuted text-xs">
                          No users match the search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-mindful-bg/40 transition-colors">

                          {/* Name & Email */}
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-mindful-purple text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                                {u.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="font-bold text-mindful-textDark">{u.name}</p>
                                <p className="text-[11px] text-mindful-textMuted">{u.email}</p>
                                {u.specialty && (
                                  <span className="inline-block mt-0.5 text-[10px] text-mindful-purple font-semibold">
                                    Specialty: {u.specialty}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="py-4 px-4 text-mindful-textDark">
                            <div className="text-xs">
                              <p className="font-medium">{u.phone || 'N/A'}</p>
                              <p className="text-[10px] text-mindful-textMuted">
                                Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                u.role === 'admin'
                                  ? 'bg-rose-100 text-rose-800'
                                  : u.role === 'therapist'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          {/* Quick Role Modifier Dropdown */}
                          <td className="py-4 px-4">
                            <select
                              disabled={actionLoading}
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-mindful-bg border border-mindful-purple-subtle text-mindful-textDark focus:outline-none focus:border-mindful-purple cursor-pointer transition-colors"
                            >
                              <option value="patient">Patient</option>
                              <option value="therapist">Therapist</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>

                          {/* Delete Action */}
                          <td className="py-4 px-4 text-right">
                            <button
                              disabled={actionLoading}
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              title="Delete from MongoDB"
                              className="p-2 rounded-xl text-rose-500 hover:text-white hover:bg-rose-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: APPOINTMENTS MANAGEMENT (Real-time MongoDB Sync)
        ========================================================================= */}
        {activeAdminTab === 'bookings' && (
          <div className="space-y-4">
            {/* Filter Header */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-mindful-purple-subtle/30 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-mindful-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search by therapist or notes..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-mindful-bg border border-mindful-purple-subtle/40 focus:outline-none focus:border-mindful-purple"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-mindful-textMuted" />
                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="text-xs py-2 px-3 rounded-xl bg-mindful-bg border border-mindful-purple-subtle/40 text-mindful-textDark font-medium focus:outline-none focus:border-mindful-purple"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="text-xs font-semibold text-mindful-textMuted">
                Total Bookings in Atlas: <span className="font-bold text-mindful-textDark">{bookings.length}</span>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-3xl border border-mindful-purple-subtle/30 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-mindful-bg/60 text-[11px] font-bold text-mindful-textMuted uppercase tracking-wider">
                      <th className="py-3.5 px-4 sm:px-6">Therapist / Session</th>
                      <th className="py-3.5 px-4">Schedule</th>
                      <th className="py-3.5 px-4">Current Status (MongoDB)</th>
                      <th className="py-3.5 px-4">Update Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-10 text-center text-mindful-textMuted text-xs">
                          No bookings found.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b._id} className="hover:bg-mindful-bg/40 transition-colors">

                          {/* Therapist info */}
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={b.therapistAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120'}
                                alt={b.therapistName}
                                className="w-9 h-9 rounded-full object-cover border border-mindful-purple-subtle"
                              />
                              <div>
                                <p className="font-bold text-mindful-textDark">{b.therapistName}</p>
                                <p className="text-[11px] text-mindful-textMuted">
                                  {b.type || 'Video Consultation'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Schedule */}
                          <td className="py-4 px-4 text-mindful-textDark">
                            <p className="font-semibold">{b.date}</p>
                            <p className="text-[11px] text-mindful-textMuted">{b.time}</p>
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                b.status === 'Confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.status === 'Completed'
                                  ? 'bg-slate-100 text-slate-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  b.status === 'Confirmed'
                                    ? 'bg-emerald-500'
                                    : b.status === 'Completed'
                                    ? 'bg-slate-500'
                                    : 'bg-rose-500'
                                }`}
                              ></span>
                              {b.status || 'Confirmed'}
                            </span>
                          </td>

                          {/* Status Modifier Dropdown */}
                          <td className="py-4 px-4">
                            <select
                              disabled={actionLoading}
                              value={b.status || 'Confirmed'}
                              onChange={(e) => handleBookingStatusChange(b._id, e.target.value)}
                              className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-mindful-bg border border-mindful-purple-subtle text-mindful-textDark focus:outline-none focus:border-mindful-purple cursor-pointer transition-colors"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Delete Booking */}
                          <td className="py-4 px-4 text-right">
                            <button
                              disabled={actionLoading}
                              onClick={() => handleDeleteBooking(b._id)}
                              title="Delete from MongoDB"
                              className="p-2 rounded-xl text-rose-500 hover:text-white hover:bg-rose-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: DATABASE & BACKEND TELEMETRY
        ========================================================================= */}
        {activeAdminTab === 'database' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-mindful-purple-subtle/30 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-mindful-textDark">MongoDB Atlas Cluster Telemetry</h3>
                  <p className="text-xs text-mindful-textMuted">Active replica set connection & collection schema state</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-mindful-bg border border-mindful-purple-subtle/20 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-mindful-textMuted">Database Connection:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Atlas ReplicaSet Active
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mindful-textMuted">Cluster Name:</span>
                    <span className="font-semibold text-mindful-textDark">MentalHealthDB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mindful-textMuted">Database Name:</span>
                    <span className="font-semibold text-mindful-textDark">mindfulDB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mindful-textMuted">Auth User:</span>
                    <span className="font-mono text-mindful-textDark">nazehamosharaf_db_user</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-mindful-bg border border-mindful-purple-subtle/20 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-mindful-textMuted">Backend API Base:</span>
                    <span className="font-mono text-mindful-purple">http://localhost:8000/api</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mindful-textMuted">Active Collections:</span>
                    <span className="font-semibold text-mindful-textDark">users, moods, journals, bookings, goals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mindful-textMuted">Realtime Mutations:</span>
                    <span className="font-semibold text-emerald-600">Enabled (Direct Mongoose sync)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mindful-textMuted">Password Encryption:</span>
                    <span className="font-semibold text-mindful-textDark">bcryptjs (10 rounds)</span>
                  </div>
                </div>
              </div>

              {/* Seed / Default Credentials Info */}
              <div className="mt-6 p-4 rounded-2xl bg-purple-50/60 border border-mindful-purple-subtle/40 text-xs">
                <p className="font-bold text-mindful-purple mb-1">Default Pre-seeded Logins in MongoDB:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-mindful-textDark">
                  <div>
                    <span className="font-bold text-rose-600">Admin:</span>
                    <p className="font-mono text-[11px]">admin@mindful.org / admin123</p>
                  </div>
                  <div>
                    <span className="font-bold text-purple-600">Therapist:</span>
                    <p className="font-mono text-[11px]">dr.sarah@mindful.org / therapist123</p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-600">Patient:</span>
                    <p className="font-mono text-[11px]">alex@mindful.org / password123</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            ADD USER MODAL (Direct to MongoDB)
        ========================================================================= */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-mindful-purple-subtle/30 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-mindful-purple text-white flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-mindful-textDark">Add User to MongoDB</h3>
                </div>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-mindful-textMuted hover:text-mindful-textDark p-1"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-bold text-mindful-textDark mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-mindful-bg border border-mindful-purple-subtle/40 focus:outline-none focus:border-mindful-purple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-mindful-textDark mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="e.g. john@mindful.org"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-mindful-bg border border-mindful-purple-subtle/40 focus:outline-none focus:border-mindful-purple"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-mindful-textDark mb-1">
                      Role
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-mindful-bg border border-mindful-purple-subtle/40 text-mindful-textDark focus:outline-none focus:border-mindful-purple"
                    >
                      <option value="patient">Patient</option>
                      <option value="therapist">Therapist</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-mindful-textDark mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="password123"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-mindful-bg border border-mindful-purple-subtle/40 focus:outline-none focus:border-mindful-purple"
                    />
                  </div>
                </div>

                {newUser.role === 'therapist' && (
                  <div>
                    <label className="block text-xs font-bold text-mindful-textDark mb-1">
                      Therapist Specialty
                    </label>
                    <input
                      type="text"
                      value={newUser.specialty}
                      onChange={(e) => setNewUser({ ...newUser, specialty: e.target.value })}
                      placeholder="e.g. Cognitive Behavioral Therapy (CBT)"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-mindful-bg border border-mindful-purple-subtle/40 focus:outline-none focus:border-mindful-purple"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-mindful-textDark mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-mindful-bg border border-mindful-purple-subtle/40 focus:outline-none focus:border-mindful-purple"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-mindful-textMuted hover:bg-mindful-bg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-xl bg-mindful-purple text-white text-xs font-bold hover:bg-mindful-purple-dark shadow-soft"
                  >
                    {actionLoading ? 'Saving to Atlas...' : 'Create in MongoDB'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
