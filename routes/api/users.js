const express = require("express");
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require("express-validator");

// Import User model
const User = require('../../models/User')

// @route  POST api/users
// @desc   Register user
// @access Public
router.post(
    "/",
    [
        check("name", "Name is required")
            .not()
            .isEmpty(),
        check('email', 'Please include a valid email')
            .isEmail(),
        check('password', 'Please enter a password with 6 or more characters')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        // If there are errors, return status 400 with an array of the errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Pull user details out of request.body
        const { name, email, password } = req.body;

        try {
            // Check if user exists
            let user = await User.findOne({ email });


            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            // Get users gravatar
            const avatar = gravatar.url(email, {
                // Size
                s: '200',
                // Rating
                r: 'pg',
                // Default
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            });

            // Encrypt password using bcryptjs
            // Create salt, 10 rounds (more is more secure but slower)
            const salt = await bcrypt.genSalt(10);

            // Hash password, takes in plain text password and salt
            user.password = await bcrypt.hash(password, salt);

            // Save the user (Anything that returns a promise use await)
            await user.save();

            // Get payload which includes only user.id
            const payload = {
                user: {
                    id: user.id
                }
            }

            // Sign token
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                // Set expiration
                // TODO Change to 3600
                { expiresIn: '5 days' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });

        } catch (err) {
            //
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
