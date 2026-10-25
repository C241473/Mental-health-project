const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Mood = require('./models/Mood');
const Journal = require('./models/Journal');
const Booking = require('./models/Booking');
const Goal = require('./models/Goal');

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mindfulDB';
    await mongoose.connect(mongoUri);
    console.log('🍃 Connected to MongoDB for seeding...');

    // 1. Seed demo patient
    let user = await User.findOne({ email: 'alex@mindful.org' });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      user = new User({
        name: 'Alex Johnson',
        email: 'alex@mindful.org',
        password: hashedPassword,
        role: 'patient',
        phone: '+1 (555) 349-8821',
        bio: 'Dedicated to daily mindfulness, emotional regulation, and peaceful living.',
        emergencyContact: '+1 (555) 234-5678 (Dr. Marcus)',
        timezone: 'Eastern Time (US & Canada) - GMT-5',
        dailyReminderTime: '08:30 AM',
        notificationsEnabled: true,
        ambientAnimations: true,
        soundEffects: true,
        avatarColor: 'from-mindful-purple to-mindful-peach'
      });
      await user.save();
      console.log('✅ Patient user created:', user.email);
    } else {
      console.log('ℹ️ Patient already exists:', user.email);
    }

    // 1b. Seed Admin User
    let adminUser = await User.findOne({ email: 'admin@mindful.org' });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      adminUser = new User({
        name: 'System Administrator',
        email: 'admin@mindful.org',
        password: hashedPassword,
        role: 'admin',
        phone: '+1 (555) 999-0001',
        bio: 'Mindful Platform System Administrator & Clinic Director.',
        emergencyContact: '+1 (555) 999-0000',
        timezone: 'Eastern Time (US & Canada) - GMT-5',
        dailyReminderTime: '09:00 AM',
        notificationsEnabled: true,
        ambientAnimations: true,
        soundEffects: true,
        avatarColor: 'from-purple-700 to-indigo-800'
      });
      await adminUser.save();
      console.log('✅ Admin user created in MongoDB Atlas:', adminUser.email);
    }

    // 1c. Seed Therapist User
    let therapistUser = await User.findOne({ email: 'dr.sarah@mindful.org' });
    if (!therapistUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('therapist123', salt);
      therapistUser = new User({
        name: 'Dr. Sarah Ahmed',
        email: 'dr.sarah@mindful.org',
        password: hashedPassword,
        role: 'therapist',
        specialty: 'Clinical Psychologist',
        phone: '+1 (555) 456-7890',
        bio: '12+ years experience in cognitive behavioral therapy and mindfulness-based stress reduction.',
        emergencyContact: '+1 (555) 456-7899',
        timezone: 'Eastern Time (US & Canada) - GMT-5',
        dailyReminderTime: '08:00 AM',
        notificationsEnabled: true,
        ambientAnimations: true,
        soundEffects: true,
        avatarColor: 'from-pink-500 to-rose-600'
      });
      await therapistUser.save();
      console.log('✅ Therapist user created in MongoDB Atlas:', therapistUser.email);
    }

    // 2. Seed initial moods
    const existingMoods = await Mood.countDocuments();
    if (existingMoods === 0) {
      await Mood.insertMany([
        {
          userId: user._id,
          mood: 'great',
          score: 5,
          emotions: ['Inspired', 'Calm', 'Joyful'],
          activities: ['Meditation', 'Nature Walk'],
          note: 'Woke up feeling deeply refreshed. Completed 15 minutes of rhythmic breathwork.',
          date: new Date()
        },
        {
          userId: user._id,
          mood: 'good',
          score: 4,
          emotions: ['Peaceful', 'Content'],
          activities: ['Yoga', 'Journaling'],
          note: 'A quiet, productive afternoon with herbal chamomile tea.',
          date: new Date(Date.now() - 86400000)
        },
        {
          userId: user._id,
          mood: 'okay',
          score: 3,
          emotions: ['Reflective', 'Tired'],
          activities: ['Reading'],
          note: 'Work was a bit demanding today. Practiced box breathing.',
          date: new Date(Date.now() - 172800000)
        }
      ]);
      console.log('✅ Initial moods created in MongoDB.');
    }

    // 3. Seed initial journals
    const existingJournals = await Journal.countDocuments();
    if (existingJournals === 0) {
      await Journal.insertMany([
        {
          userId: user._id,
          title: 'Finding Stillness in the Morning Mist',
          content: 'Today I woke up before sunrise and spent twenty minutes listening to the soft rain. Watching the drops on the leaves made me realize that emotional stillness is not the absence of storms, but finding peace within them.',
          mood: 'great',
          category: 'Reflection',
          tags: ['Stillness', 'Morning', 'Peace'],
          isFavorite: true,
          date: new Date()
        },
        {
          userId: user._id,
          title: 'Three Little Things I Am Grateful For',
          content: '1. The warm cup of lavender tea this morning.\n2. A kind text message from a close friend checking in.\n3. The courage to pause when anxiety started creeping in during my afternoon meeting.',
          mood: 'good',
          category: 'Gratitude',
          tags: ['Gratitude', 'DailyWins'],
          isFavorite: true,
          date: new Date(Date.now() - 86400000)
        }
      ]);
      console.log('✅ Initial journals created in MongoDB.');
    }

    // 4. Seed initial bookings
    const existingBookings = await Booking.countDocuments();
    if (existingBookings === 0) {
      await Booking.insertMany([
        {
          userId: user._id,
          therapistName: 'Dr. Sarah Ahmed',
          therapistRole: 'Clinical Psychologist',
          therapistAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120',
          date: 'Tomorrow, Oct 26',
          time: '04:00 PM',
          type: 'Video Consultation',
          status: 'Confirmed',
          notes: 'Quarterly mindfulness check-in & stress coping mechanisms.'
        }
      ]);
      console.log('✅ Initial booking created in MongoDB.');
    }

    // 5. Seed initial goals
    const existingGoals = await Goal.countDocuments();
    if (existingGoals === 0) {
      await Goal.insertMany([
        { userId: user._id, title: '10 min Morning Breathwork', category: 'Mindfulness', completed: true },
        { userId: user._id, title: 'Drink 2L Water & Herbal Tea', category: 'Physical', completed: true },
        { userId: user._id, title: 'Write in Evening Journal', category: 'Reflection', completed: false },
        { userId: user._id, title: 'Screen-Free 30 min Before Sleep', category: 'Rest', completed: false }
      ]);
      console.log('✅ Initial goals created in MongoDB.');
    }

    console.log('🎉 MongoDB database "mindfulDB" successfully created and populated!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
