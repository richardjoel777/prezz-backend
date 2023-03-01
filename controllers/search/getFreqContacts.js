import mongoose from "../../init/mongoose.js";
import redis from "../../init/redis.js";

export default async (req, res) => {
    try {
        const { organization_id } = req.body;

        const user = JSON.parse((await redis.get(`user:${req.userId}`)));

        const contacts = await mongoose.message.aggregate([
            { $match: { is_private: true, organization_id } },
            {
                $group: {
                    _id: { $cond: [{ $eq: ['$sender', user] }, '$receiver', '$sender'] },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: 0,
                    contact: '$_id'
                }
            }
        ]);

        console.log(contacts.filter(contact => contact.contact.toString() !== user._id.toString()));
        console.log(user._id);

        const contactsData = await Promise.all(contacts.filter(contact => contact.contact.toString() !== user._id.toString()).map(async contact => {
            const user = await mongoose.user.findById(contact.contact, {
                first_name: 1,
                last_name: 1,
                user_id: 1,
                image_url: 1,
            });
            return user;
        }));

        res.code(200).send({ contacts: contactsData });
    }
    catch (error) {
        console.log(error);
        res.code(500).send({ message: "Server Error" });
    }
}