const jwt = require('jsonwebtoken');
const redisClient = require('../redisClient');  // Import Redis client
var config = require('../config');

// Middleware function to verify token
async function verifyToken(req, res, next) {
    let token = req.headers['authorization']; // Retrieve the Authorization header

    console.log('Authorization Header:', token);

    // Check for missing or malformed Authorization header
    if (!token || !token.includes('Bearer ')) {
        console.log('Token missing or malformed!');
        res.status(403);
        return res.json({ auth: false, message: 'Token missing or malformed!' });
    }

    // Extract the token value
    token = token.split('Bearer ')[1];
    console.log('Extracted Token:', token);

    try {
        // Check if the token is blacklisted in Redis
        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        console.log('Blacklist check result for token:', isBlacklisted);

        if (isBlacklisted) {
            console.log('Token is blacklisted!');
            res.status(403);
            return res.json({ auth: false, message: 'Token has been invalidated due to logout!' });
        }

        // Verify the token's validity
        jwt.verify(token, config.key, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    console.log('Token has expired:', err);
                    return res.status(401).json({
                        auth: false,
                        message: 'Token has expired! Please log in again.',
                        expiredAt: err.expiredAt  // Include expiration time for debugging
                    });
                }

                console.log('Invalid token:', err);
                return res.status(403).json({ auth: false, message: 'Invalid token!' });
            }

            console.log('Token successfully verified. User ID:', decoded.id);

            // Attach user data to the request object
            req.id = decoded.id;
            req.token = token;  // Save the token for logout or other operations
            next();
        });
    } catch (err) {
        console.error('Error verifying token:', err);
        res.status(500);
        return res.json({ auth: false, message: 'Internal server error while verifying token.' });
    }
}

module.exports = verifyToken;
