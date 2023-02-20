import mongoose from "../init/mongoose.js";
import Mongoose from "mongoose";
import { validatePermission } from "./index.js";

export default async (socket, io, data) => {
    try {
        const { chat_id, message_id, expires_at = new Date("2100-01-01") } = data;

        const user = await mongoose.user.findOne({
            user_id: socket.userId,
        });

        const message = await mongoose.message.findOne({
            _id: Mongoose.Types.ObjectId(message_id),
        });

        if (!message.is_private) {
            if (!validatePermission(socket, chat_id, "pin_messages")) {
                return;
            }
        }

        await mongoose.channel.findOneAndUpdate(
            {
                _id: Mongoose.Types.ObjectId(chat_id),
            },
            {
                pinned_message: {
                    message,
                    pinned_by: user,
                    expires_at,
                },
            }
        );

        io.to(chat_id).emit("pinned-message", {
            message,
            pinned_by: user,
            expires_at,
        });


    } catch (error) {
        console.log(error);
    }

}