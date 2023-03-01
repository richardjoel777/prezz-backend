import redis from 'redis';

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
    username: process.env.REDIS_USER,
});

await client.connect();

export default client;