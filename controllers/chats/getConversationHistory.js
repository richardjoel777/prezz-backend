import mongoose from "../../init/mongoose.js";
import { populateMessage } from "../../listeners/index.js";

export default async (req, res) => {
    try {
        const { organization_id, query = "", offset = 0 } = req.body;
        const regex = new RegExp(["^", ".", "*", query, ".", "*", "$"].join(""), "i");

        const user = await mongoose.user.findOne({
            user_id: req.userId,
        });

        const userChannels = await mongoose.channel.find({
            organization_id,
            members: {
                $elemMatch: {
                    user_id: req.userId,
                }
            }
        });


        const messages = await populateMessage(mongoose.message.find({
            organization_id,
            content: {
                $regex: regex,
            },
            $or: [
                {
                    sender: user._id,
                },
                {
                    chat_id: {
                        $in: userChannels.map(channel => channel._id.toString()),
                    }
                },
                {
                    receiver: user._id,
                },
            ]
        })
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(20))

        return res.code(200).send(messages);

    } catch (error) {
        console.log(error);
        res.code(500).send({ message: "Internal Server Error" });
    }
}