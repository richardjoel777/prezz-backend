import redis from 'redis';

const client = redis.createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASS,
    username: process.env.REDIS_USER,
});

await client.connect();

export default client;