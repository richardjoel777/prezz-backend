import { SOCKET_USERS } from "../server.js";
import mongoose from '../init/mongoose.js';
import { addReactions, populateMessage } from "./index.js";

export default async (socket, io, data) => {
    try {
        const { id, reaction } = data;

        const message
            = await mongoose.message
                .findById(id)
                .populate({
                    path: "sender",
                    select: {
                        user_id: 1,
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        image_url: 1,
                    }
                })
                .populate({
                    path: "receiver",
                    select: {
                        user_id: 1,
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        image_url: 1,
                    }
                })
                .populate({
                    path: "read_by",
                    select: {
                        user_id: 1,
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        image_url: 1,
                    }
                })
                .populate({
                    path: "reactions.user",
                    select: {
                        user_id: 1,
                        first_name: 1,
                        last_name: 1,
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
                        files: 1,
                        created_at: 1,
                    },
                    populate: {
                        path: "sender",
                        select: {
                            user_id: 1,
                            first_name: 1,
                            last_name: 1,
                        }
                    }
                })

        const user = await mongoose.user.findOne({ user_id: socket.userId });

        const reactionExists = await mongoose.message.findOne({ _id: id, reactions: { $elemMatch: { user, reaction: reaction } } });


        let messageData

        if (!reactionExists) {
            await mongoose.message.updateOne({
                _id: id
            }, {
                $push: {
                    reactions: {
                        user,
                        reaction,
                    }
                }
            })
            // console.log("Reaction added");
        } else {
            await mongoose.message.updateOne({
                _id: id
            }, {
                $pull: {
                    reactions: {
                        user,
                        reaction,
                    }
                }
            })
            // console.log("Reaction removed");
        }

        messageData = await populateMessage(mongoose.message
            .findById(id))

        messageData = addReactions([messageData])[0];

        return io.to(message.chat_id).emit('react-message', messageData);
    } catch (error) {
        console.log(error);
    }
}