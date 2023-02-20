import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    try {

        const user = await mongoose.user.findOne({ user_id: req.userId });

        const messages = await mongoose.message.find({
            starred_by: {
                $elemMatch: {
                    user: user._id,
                }
            }
        })
            .populate({
                path: "sender",
                select: {
                    user_id: 1,
                    first_name: 1,
                    last_name: 1,
                    email: 1,
                    mini_avatar_url: 1,
                }
            })
            .populate({
                path: "receiver",
                select: {
                    user_id: 1,
                    first_name: 1,
                    last_name: 1,
                    email: 1,
                    mini_avatar_url: 1,
                }
            })
            .populate({
                path: "starred_by.user",
                select: {
                    user_id: 1,
                }
            })
            .populate({
                path: "reply_to",
                select: {
                    content: 1,
                    sender: 1,
                    created_at: 1,
                    files: 1,
                },
                populate: {
                    path: "sender",
                    select: {
                        user_id: 1,
                        first_name: 1,
                        last_name: 1,
                    }
                }
            });


        const messagesData = await Promise.all(messages.map(async (message) => {
            if (!message.is_private) {
                console.log("PRIVATE");
                const channel = await mongoose.channel.findOne({
                    _id: message.chat_id,
                }, {
                    name: 1,
                })
                return {
                    ...message._doc,
                    channel,
                }
            }

            return message._doc;
        }))

        res.code(200).send({
            messages: messagesData.map((message) => {
                return {
                    ...message,
                    starred_by: message.starred_by.filter((star) => {
                        return star.user.user_id === req.userId;
                    })
                }
            })
        });

    } catch (error) {
        console.log(error);
        res.code(500).send({ message: "Internal server error" });
    }
}