const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'therapist', 'admin'], default: 'patient' },
  specialty: { type: String, default: null },
  phone: { type: String, default: '+1 (555) 349-8821' },
  bio: { type: String, default: 'Dedicated to daily mindfulness, emotional regulation, and peaceful living.' },
  emergencyContact: { type: String, default: '+1 (555) 234-5678 (Dr. Marcus)' },
  timezone: { type: String, default: 'Eastern Time (US & Canada) - GMT-5' },
  dailyReminderTime: { type: String, default: '08:30 AM' },
  notificationsEnabled: { type: Boolean, default: true },
  ambientAnimations: { type: Boolean, default: true },
  soundEffects: { type: Boolean, default: true },
  avatarColor: { type: String, default: 'from-mindful-purple to-mindful-peach' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
