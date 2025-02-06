const redis = require('redis'); 

// Create the Redis client instance (connect to 127.0.0.1:6379)
const redisClient = redis.createClient({
    url: 'redis://127.0.0.1:6379'
});

// Handle connection errors
redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

// Connect to Redis (async/await recommended)
(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis!');
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();

// Export the Redis client for use in other files
module.exports = redisClient;