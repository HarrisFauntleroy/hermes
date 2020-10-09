// Routes for profiles

// Bring in express
const express = require('express')
// Use express router
const router = express.Router();

// @route  GET api/profile
// @desc   Test route
// @access Public
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;