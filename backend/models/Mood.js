const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false // allows demo logs without strict auth
  },
  mood: { 
    type: String, 
    enum: ['very-bad', 'bad', 'okay', 'good', 'great'], 
    required: true 
  },
  score: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  emotions: [{ 
    type: String 
  }],
  activities: [{ 
    type: String 
  }],
  note: { 
    type: String, 
    default: '' 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Mood', moodSchema);
