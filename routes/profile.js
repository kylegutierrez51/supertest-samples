// routes/profile.js
const express = require('express');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.get('/me', authenticate, (req, res) => {
  res.status(200).json({ id: req.user.id, email: req.user.email });
});

router.put('/me', authenticate, (req, res) => {
  const { displayName } = req.body;
  if (!displayName)
    return res.status(400).json({ error: 'displayName is required' });

  res.status(200).json({ id: req.user.id, email: req.user.email, displayName });
});

module.exports = router;