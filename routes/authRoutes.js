import express, { response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userSchema.js'; // Ensure correct path

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set in .env file!');
    process.exit(1); // Exit the app if missing
}

// POST /signin (Sign Up)
router.post('/signin', async (req, res) => {
    try {
        let { username, email, password } = req.body;

        // Trim user input
        username = username?.trim();
        email = email?.trim();
        password = password?.trim();
       console.log({username ,email ,password})
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(12); // Stronger salt rounds
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        console.log('✅ New User Created:', { username, email });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('❌ Sign-in error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /login (Log In)
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;

        email = email?.trim();
        password = password?.trim();

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
        });



    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
