const express = require('express');
const router = express.Router();
const connectToDatabase = require('../config/db');

// Search / filter gift items by category, name, or condition
router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('gifts');

    let query = {};

    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    if (req.query.condition && req.query.condition !== 'All') {
      query.condition = req.query.condition;
    }

    if (req.query.age_years) {
      query.age_years = { $lte: parseInt(req.query.age_years) };
    }

    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }

    const results = await collection.find(query).toArray();
    res.json(results);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
