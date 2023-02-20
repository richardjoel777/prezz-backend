import mongoose from "../init/mongoose.js";
import Mongoose from "mongoose";

export default async (socket, io, data) => {
    try {
        console.log("unpin-chat", data)
        const { chat_id } = data;
        // const _id = Mongoose.Types.ObjectId(id)
        // console.log(_id)
        await mongoose.user.updateOne({
            user_id: socket.userId,
        }, {
            $pull: {
                pinned_chats: {
                    chat_id
                }
            }
        })

        const pinned_chats = (await mongoose.user.findOne({
            user_id: socket.userId,
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

        const orgPinnedChats = pinned_chats.filter(chat => chat.organization_id === data.organization_id)

        const user = await mongoose.user.findOne({
            user_id: socket.userId,
        }).select({
            user_id: 1,
        });

        const userChannels = await mongoose.channel.find({
            organization_id: data.organization_id,
            members: {
                $elemMatch: {
                    user,
                }
            }
        }, {
            _id: true,
        })

        const conversations = await mongoose.message.find({
            organization_id: data.organization_id,
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
        // console.log("[CONVERSATIONS]", conversations);

        const conversationsData = await Promise.all(conversations.map(async (conversation) => {
            if (conversation.includes(":")) {
                const receiver_id = conversation.split(":")[0] === socket.userId ? conversation.split(":")[1] : conversation.split(":")[0];
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

        return io.to(socket.userId).emit("unpin-chat", {
            pinned_chats: orgPinnedChats,
            conversations: conversationsData,
        })
    } catch (error) {
        console.log(error);
        return;
    }
}