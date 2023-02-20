import prisma from "../init/prisma.js";
import mongoose from "../init/mongoose.js";
import { SOCKET_USERS } from "../server.js";
import { addReactions, populateMessage } from "./index.js";

export default async (socket, io, data) => {
    try {
        console.log("Fetch messages", data);
        const { offset = 0, is_private } = data;

        const chat_id = is_private ? [socket.userId, data.chat_id].sort().join(":") : data.chat_id

        const messages = await populateMessage(mongoose.message
            .find({
                chat_id,
            })
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(15))

        const messagesData = addReactions(messages);

        // console.log("Fetch messages", messagesData.map(message => message.content));

        console.log("is finished", messagesData.length < 15)

        console.log("is reload", offset !== 0)

        socket.emit("fetch-messages", { messages: messagesData.reverse(), isFinished: messagesData.length < 15, isReload: offset !== 0 });
    }
    catch (error) {
        console.log(error);
        return;
    }
}