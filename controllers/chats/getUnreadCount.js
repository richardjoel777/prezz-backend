import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    try {

        const user = await mongoose.user.findOne({
            user_id: req.userId,
        });

        const channels = await mongoose.channel.find({
            organization_id: req.body.organization_id,
            members: {
                $elemMatch: {
                    user,
                }
            }
        });

        console.log("[CHANNELS]", channels.map(channel => channel._id));

        const messages = await mongoose.message.aggregate([
            {
                $match: {
                    $and: [
                        {
                            sender: {
                                $ne: user._id,
                            },
                        },
                        {
                            $or: [
                                {
                                    chat_id: {
                                        $in: channels.map(channel => channel._id.toString()),
                                    },
                                },
                                {
                                    receiver: user._id,
                                }
                            ],
                        },
                        {
                            read_by: {
                                $ne: user._id,
                            }
                        }
                    ]
                },
            },
            {
                $group: {
                    _id: "$chat_id",
                    count: {
                        $sum: 1,
                    }
                }
            }]);

        console.log(messages);

        const unreadCount = messages.reduce((acc, message) => {
            acc[message._id] = message.count;
            return acc;
        }, {});

        return res.code(200).send({
            unreadCount,
        });

    }
    catch (error) {
        console.log(error);
        return res.code(500).send({ message: "Internal server error" });
    }
}