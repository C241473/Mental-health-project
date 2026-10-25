const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Models
const User = require('./models/User');
const Mood = require('./models/Mood');
const Journal = require('./models/Journal');
const Booking = require('./models/Booking');
const Goal = require('./models/Goal');

// Auth Middleware
const auth = require('./middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'mindful_jwt_secret_key_2026_super_secure_auth';

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;

if (mongoUri && !mongoUri.includes('<CLUSTER_HOST>')) {
  mongoose.connect(mongoUri)
    .then(() => console.log('🍃 MongoDB connected successfully to Mindful Database!'))
    .catch(err => console.error('⚠️ MongoDB connection error:', err.message));
} else {
  console.log('ℹ️ MONGODB_URI is pending cluster hostname in backend/.env. API running with demo mock fallbacks.');
}

// ==========================================
// 1. HEALTH CHECK & STATUS
// ==========================================
app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'online',
    appName: 'Mindful Wellness Backend API',
    database: dbStates[mongoose.connection.readyState] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 2. AUTHENTICATION ROUTES
// ==========================================

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password, role, specialty } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'patient',
      specialty: role === 'therapist' ? specialty : null
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        specialty: newUser.specialty
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'User not found with this email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bio: user.bio,
        emergencyContact: user.emergencyContact,
        timezone: user.timezone,
        dailyReminderTime: user.dailyReminderTime,
        notificationsEnabled: user.notificationsEnabled,
        avatarColor: user.avatarColor
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// ==========================================
// 3. USER PROFILE MANAGEMENT
// ==========================================

// Get current user profile
app.get('/api/user/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving profile', error: err.message });
  }
});

// Update profile details
app.put('/api/user/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = [
      'name', 'phone', 'bio', 'emergencyContact', 
      'timezone', 'dailyReminderTime', 'notificationsEnabled', 
      'ambientAnimations', 'soundEffects', 'avatarColor'
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

// Change password
app.put('/api/user/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password does not match' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to change password', error: err.message });
  }
});

// ==========================================
// 4. MOOD TRACKING & ANALYTICS APIs
// ==========================================

// Get all moods
app.get('/api/moods', async (req, res) => {
  try {
    const query = {};
    if (req.query.userId) query.userId = req.query.userId;
    const moods = await Mood.find(query).sort({ date: -1 }).limit(100);
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch moods', error: err.message });
  }
});

// Create new mood log
app.post('/api/moods', async (req, res) => {
  const { mood, score, emotions, activities, note, date, userId } = req.body;

  const scoreMap = { 'very-bad': 1, 'bad': 2, 'okay': 3, 'good': 4, 'great': 5 };
  const calculatedScore = score || scoreMap[mood] || 3;

  try {
    const newMood = new Mood({
      userId: userId || null,
      mood: mood || 'good',
      score: calculatedScore,
      emotions: emotions || [],
      activities: activities || [],
      note: note || '',
      date: date ? new Date(date) : new Date()
    });

    const savedMood = await newMood.save();
    res.status(201).json(savedMood);
  } catch (err) {
    res.status(500).json({ message: 'Failed to log mood', error: err.message });
  }
});

// Delete mood log
app.delete('/api/moods/:id', async (req, res) => {
  try {
    await Mood.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mood entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete mood', error: err.message });
  }
});

// Mood Analytics (weekly & monthly statistics)
app.get('/api/moods/analytics', async (req, res) => {
  try {
    const moods = await Mood.find().sort({ date: -1 }).limit(30);
    const totalLogs = moods.length;
    const avgScore = totalLogs > 0 
      ? (moods.reduce((acc, m) => acc + m.score, 0) / totalLogs).toFixed(1) 
      : 0;

    const moodCounts = { 'great': 0, 'good': 0, 'okay': 0, 'bad': 0, 'very-bad': 0 };
    moods.forEach(m => {
      if (moodCounts[m.mood] !== undefined) moodCounts[m.mood]++;
    });

    res.json({
      totalLogs,
      avgScore: Number(avgScore),
      moodDistribution: moodCounts,
      recentEntries: moods.slice(0, 7)
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to compute mood analytics', error: err.message });
  }
});

// ==========================================
// 5. PERSONAL JOURNAL / DIARY APIs
// ==========================================

// Get all journal entries
app.get('/api/journals', async (req, res) => {
  try {
    const query = {};
    if (req.query.userId) query.userId = req.query.userId;
    if (req.query.category && req.query.category !== 'All') query.category = req.query.category;
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const entries = await Journal.find(query).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch journals', error: err.message });
  }
});

// Create new journal entry
app.post('/api/journals', async (req, res) => {
  const { title, content, mood, category, tags, userId } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const newEntry = new Journal({
      userId: userId || null,
      title,
      content,
      mood: mood || 'good',
      category: category || 'Reflection',
      tags: tags || ['Personal'],
      date: new Date()
    });

    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create journal entry', error: err.message });
  }
});

// Update journal entry
app.put('/api/journals/:id', async (req, res) => {
  try {
    const updated = await Journal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Journal entry not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update journal entry', error: err.message });
  }
});

// Toggle favorite
app.patch('/api/journals/:id/favorite', async (req, res) => {
  try {
    const entry = await Journal.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Journal entry not found' });
    entry.isFavorite = !entry.isFavorite;
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle favorite', error: err.message });
  }
});

// Delete journal entry
app.delete('/api/journals/:id', async (req, res) => {
  try {
    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete journal entry', error: err.message });
  }
});

// ==========================================
// 6. APPOINTMENT BOOKING APIs
// ==========================================

// Get user appointments
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: err.message });
  }
});

// Create appointment
app.post('/api/bookings', async (req, res) => {
  const { therapistName, therapistRole, therapistAvatar, date, time, type, notes, userId } = req.body;

  if (!therapistName || !date || !time) {
    return res.status(400).json({ message: 'Therapist, date, and time are required' });
  }

  try {
    const newBooking = new Booking({
      userId: userId || null,
      therapistName,
      therapistRole: therapistRole || 'Clinical Psychologist',
      therapistAvatar: therapistAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120',
      date,
      time,
      type: type || 'Video Consultation',
      notes: notes || '',
      status: 'Confirmed'
    });

    const saved = await newBooking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to book appointment', error: err.message });
  }
});

// Cancel appointment
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel appointment', error: err.message });
  }
});

// ==========================================
// 7. SELF-CARE GOALS APIs
// ==========================================
app.get('/api/goals', async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch goals', error: err.message });
  }
});

app.post('/api/goals', async (req, res) => {
  try {
    const newGoal = new Goal({
      title: req.body.title,
      category: req.body.category || 'Mindfulness',
      completed: false
    });
    const saved = await newGoal.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add goal', error: err.message });
  }
});

app.patch('/api/goals/:id/toggle', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    goal.completed = !goal.completed;
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle goal', error: err.message });
  }
});

// Server Listen
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Mindful Backend API Server running at http://localhost:${PORT}`);
  console.log(`🔗 API Documentation / Health: http://localhost:${PORT}/api/health`);
});
