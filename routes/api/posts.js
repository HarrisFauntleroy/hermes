//

// Bring in express
const express = require('express')
// Use express router
const router = express.Router();

// @route  GET api/posts
// @desc   Test route
// @access Public
router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;