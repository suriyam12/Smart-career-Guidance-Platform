const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get career suggestions (placeholder)
router.get('/suggestions', auth, (req, res) => {
  res.json({ message: 'Career suggestions endpoint' });
});

module.exports = router;