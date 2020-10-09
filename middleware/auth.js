const jwt = require('jsonwebtoken');
const config = require('config');

// Export middleware function that has access to req, res objects
module.exports = function (req, res, next) {

    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        // Return not authorised 401 if no token
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token 
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        next();
        req.user = decoded.user;
    } catch (err) {
        res.status(401).json({ msg: 'Token not valid' });
    }
}