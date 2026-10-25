const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  mood: { 
    type: String, 
    default: 'good' 
  },
  category: { 
    type: String, 
    default: 'Reflection' 
  },
  tags: [{ 
    type: String 
  }],
  isFavorite: { 
    type: Boolean, 
    default: false 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);
