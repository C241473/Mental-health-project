const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
        throw new Error('MONGODB_URI is missing. Add it to backend/.env.');
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is missing. Add it to backend/.env.');
}
const User = require('./models/User');

// ১. লগইন রাউট (ডাটাবেজ ভিত্তিক)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "ইউজার পাওয়া যায়নি বা ইমেইল ভুল!" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "ভুল পাসওয়ার্ড!" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            message: "লগইন সফল হয়েছে!",
            token: token,
            user: { name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        return res.status(500).json({ message: "সার্ভার এরর!", error: error.message });
    }
});

// ২. রেজিস্ট্রেশন রাউট (যা আপনার ফাইলে মিসিং ছিল)
app.post('/api/register', async (req, res) => {
    const { name, email, password, role, specialty } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "এই ইমেইল দিয়ে অলরেডি অ্যাকাউন্ট খোলা আছে!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            specialty: role === 'therapist' ? specialty : null
        });

        await newUser.save();
        return res.status(201).json({ message: "অ্যাকাউন্ট তৈরি সফল হয়েছে!" });

    } catch (error) {
        return res.status(500).json({ message: "সার্ভার এরর!", error: error.message });
    }
});

// সার্ভার পোর্ট (৮০০০ রাখা হলো আপনার কোড অনুযায়ী)
const PORT = 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});