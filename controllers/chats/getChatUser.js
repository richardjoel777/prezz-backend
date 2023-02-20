import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const { user_id } = req.body;

    try {
        const profile = await mongoose.user.findOne({
            user_id,
        }, {
            chat_rooms: false,
            pinned_chats: false,
            contacts: false,
            star_messages: false,
        })


        res.code(200).send({ profile });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
}