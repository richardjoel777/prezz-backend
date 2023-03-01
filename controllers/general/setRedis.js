import redis from '../../init/redis.js';
import mongoose from '../../init/mongoose.js';

export default async (req, res) => {
    try {
        const users = await mongoose.user.find({});

        await Promise.all(users.map(async (user) => {
            await redis.set(`user:${user.user_id}`, JSON.stringify(user));
        }
        ));

        res.code(200).send({ message: "Success" });

    } catch (error) {
        console.log(error);
        res.code(500).send({ error: "Internal server error" });
    }
}