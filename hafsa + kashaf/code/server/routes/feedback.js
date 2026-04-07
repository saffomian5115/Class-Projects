const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, rating } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const feedback = await Feedback.create({ name, email, subject, message, rating });
    res.status(201).json({ message: 'Feedback submitted successfully!', feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
