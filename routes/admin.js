// routes/admin.js
const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const router = express.Router();

router.get('/dashboard', authenticate, authorize('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard' });
});

router.delete('/users/:id', authenticate, authorize('admin', 'moderator'), (req, res) => {
  res.status(200).json({ deleted: parseInt(req.params.id) });
});

module.exports = router;