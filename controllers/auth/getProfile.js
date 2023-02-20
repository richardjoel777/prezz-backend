import mongoose from '../../init/mongoose.js';

export default async (req, res) => {
    const id = req.userId
    try {
        const profile = await mongoose.user.findOne(
            {
                user_id: id
            }, {
            channels: false,
            chat_rooms: false,
            contacts: false,
            pinned_chats: false,
            star_messages: false,
            __v: false,
            }
        );
        if (!profile)
            return res.code(404).send({ message: 'Profile not found' })

        return res.code(200).send({ message: 'Profile fetched', profile })
    } catch (error) {
        console.log(error)
        return res.code(500).send({ message: 'Internal server error' })
    }
};