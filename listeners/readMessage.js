import { SOCKET_USERS } from "../server.js";
import mongoose from "../init/mongoose.js"
import { addReactions, populateMessage } from "./index.js";

export default async (socket, io, data) => {
    try {
        const { is_private } = data;

        const chat_id = is_private ? [socket.userId, data.chat_id].sort().join(":") : data.chat_id;

        console.log("Read messages", data);

        const user = await mongoose.user.findOne({
            user_id: socket.userId
        })

        const lastReadMessage = await mongoose.message.findOne({
            chat_id,
            sender: {
                $ne: user
            },
            read_by: {
                $ne: user
            },
        })
            .sort({ created_at: 1 })
            .limit(1);

        console.log("Last read message", lastReadMessage);

        const updateCount = await mongoose.message.updateMany({
            chat_id,
            sender: {
                $ne: user
            },
            read_by: {
                $ne: user
            },
        }, {
            $push: {
                read_by: user
            }
        })

        console.log("Updated messages", updateCount.modifiedCount);

        const updatedMessages = await populateMessage(mongoose.message.find({
            chat_id,
            created_at: {
                $gte: updateCount.modifiedCount ? lastReadMessage.created_at : new Date()
            }
        }))

        const messagesData = addReactions(updatedMessages);

        console.log("Read messages", messagesData.map(message => message.content));

        // console.log("Read messages", JSON.stringify(messagesData, null, 2));

        if (updateCount.modifiedCount)
            io.to(chat_id).emit("read-message", {
                messages: messagesData,
            });
    }
    catch (error) {
        console.log(error);
    }
}