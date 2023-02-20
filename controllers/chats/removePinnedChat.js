import mongoose from "../../db/mongoose.js";

export default async (req, res) => {
    try {
        const { id } = req.body;
        await mongoose.user.updateOne({
            user_id: req.userId,
        }, {
            $pull: {
                pinned_chats: {
                    _id: id,
                }
            }
        })
        return res.code(200).send({ message: "Chat unpinned successfully" });
    } catch (error) {
        console.log(error);
        res.code(500).send({ message: "Server Error" });
    }
}