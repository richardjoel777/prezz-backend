import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    try {
        // console.log(req.body);
        const pinned_chats = (await mongoose.user.findOne({
            user_id: req.userId,
        }).populate({
            path: "pinned_chats",
            populate: {
                path: "user",
                select: {
                    first_name: 1,
                    last_name: 1,
                    user_id: 1,
                }
            },

        }).populate({
            path: "pinned_chats",
            populate: {
                path: "channel",
                select: {
                    name: 1,
                    type: 1,
                }
            },
        }).select({
            pinned_chats: 1,
        })).pinned_chats;

        const orgPinnedChats = pinned_chats.filter(chat => chat.organization_id === req.body.organization_id)

        // console.log("[PINNED_CHATS]", orgPinnedChats.map(chat => chat.chat_id));

        return res.code(200).send({ pinned_chats: orgPinnedChats });

    } catch (error) {
        console.log(error);
        res.code(500).send({ message: "Server Error" });
    }
}
