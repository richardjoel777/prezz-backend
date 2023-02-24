import mongoose from "../../init/mongoose.js";
import Mongoose from 'mongoose'

export default async (req, res) => {
    try {

        const user = await mongoose.user.findOne({
            user_id: req.userId,
        }).select({
            user_id: 1,
        });

        const userChannels = await mongoose.channel.find({
            organization_id: req.body.organization_id,
            members: {
                $elemMatch: {
                    user,
                }
            }
        }, {
            _id: true,
        })

        const conversations = await mongoose.message.find({
            organization_id: req.body.organization_id,
            $or: [
                {
                    sender: user,
                },
                {
                    receiver: user,
                },
                {
                    chat_id: {
                        $in: userChannels.map(channel => channel._id),
                    }
                }
            ]
        })
            .distinct("chat_id");
        console.log("[CONVERSATIONS]", conversations);

        const conversationsData = await Promise.all(conversations.map(async (conversation) => {
            if (conversation.includes(":")) {
                const receiver_id = conversation.split(":")[0] === req.userId ? conversation.split(":")[1] : conversation.split(":")[0];
                console.log("[RECEIVER_ID]", receiver_id, req.userId);
                const receiver = await mongoose.user.findOne({
                    user_id: receiver_id,
                }).select({
                    first_name: 1,
                    last_name: 1,
                    user_id: 1,
                });
                return {
                    chat_type: "PRIVATE",
                    user: receiver._doc,
                    chat_id: conversation,
                }
            }
            else {
                const channel = await mongoose.channel.findOne({
                    _id: conversation,
                }).select({
                    name: 1,
                    type: 1,
                });

                return {
                    chat_type: "CHANNEL",
                    channel: channel._doc,
                    chat_id: conversation,
                }
            }
        }));


        return res.code(200).send({ conversations: conversationsData });
    }
    catch (error) {
        console.log(error);
        res.code(500).send({ message: "Server Error" });
    }
}