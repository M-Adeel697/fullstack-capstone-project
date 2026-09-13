const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');

    const { email, password, firstName, lastName } = req.body;

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await collection.insertOne({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const payload = { user: { id: newUser.insertedId } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ authtoken, email, firstName, lastName });
  } catch (e) {
    next(e);
  }
});

// Login an existing user
router.post('/login', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');

    const { email, password } = req.body;

    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = { user: { id: user._id.toString() } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      authtoken,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (e) {
    next(e);
  }
});

// Update user profile info
router.put('/update', async (req, res, next) => {
  try {
    const email = req.headers.email;
    if (!email) {
      return res.status(400).json({ error: 'Email is required in headers' });
    }

    const db = await connectToDatabase();
    const collection = db.collection('users');

    const existingUser = await collection.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    existingUser.firstName = req.body.name || existingUser.firstName;
    existingUser.updatedAt = new Date();

    await collection.findOneAndUpdate(
      { email },
      { $set: existingUser },
      { returnDocument: 'after' }
    );

    const payload = { user: { id: existingUser._id.toString() } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ authtoken });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
