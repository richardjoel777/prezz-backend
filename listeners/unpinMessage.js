import mongoose from "../init/mongoose.js";
import Mongoose from "mongoose";

export default async (socket, io, data) => {
    try {
        const { chat_id } = data;

        const channel = await mongoose.channel.findOne({
            _id: Mongoose.Types.ObjectId(chat_id),
        }).populate("members.user");

        if (!channel) {
            return socket.emit("error", {
                message: "Channel not found",
            });
        }

        const memberRole = channel.members.find(
            (member) => member.user.user_id === socket.userId
        ).role;

        if (channel.permissions.filter(permission => permission.role === memberRole && permission.permissions.pin_messages === true).length === 0)
            return socket.emit("error", {
                message: "You don't have permission to pin messages in this channel",
            });

        await mongoose.channel.findOneAndUpdate(
            {
                _id: Mongoose.Types.ObjectId(chat_id),
            },
            {
                $unset: {
                    pinned_message: 1,
                }
            }
        );

        io.to(chat_id).emit("unpinned-message", chat_id);


    } catch (error) {
        console.log(error);
    }

}