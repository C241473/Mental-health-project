const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false 
  },
  therapistName: { 
    type: String, 
    required: true 
  },
  therapistRole: { 
    type: String, 
    default: 'Clinical Psychologist' 
  },
  therapistAvatar: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120' 
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['Video Consultation', 'Audio Call', 'Chat Session'], 
    default: 'Video Consultation' 
  },
  status: { 
    type: String, 
    enum: ['Confirmed', 'Completed', 'Cancelled'], 
    default: 'Confirmed' 
  },
  notes: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
