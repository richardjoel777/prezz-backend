import { SOCKET_USERS } from "../server.js";
// import prisma from "../db/prisma.js";
import mongoose from "../init/mongoose.js";
import Mongoose from "mongoose";
import uploadFile from "../helpers/uploadFile.js";
import { populateMessage } from "./index.js";
import { validatePermission } from "./index.js"

export default async (socket, io, data) => {
    const { content = "", is_private, organization_id, reply_to = "" } = data;

    console.log('[DATA]', data);

    try {

        // console.log("[FILES]", data);

        console.log("IS PRIVATE", is_private)

        const chat_id = is_private ? [socket.userId, data.chat_id].sort().join(":") : data.chat_id;

        const sender = await mongoose.user.findOne({
            user_id: socket.userId
        })

        if (!is_private) {

            const channel = await mongoose.channel.findOne({
                _id: Mongoose.Types.ObjectId(chat_id)
            }).populate({
                path: "members.user",
                select: {
                    user_id: 1,
                }
            })

            if (channel.is_archived) {
                return socket.emit("error", "Channel is archived");
            }

            if (!validatePermission(socket, channel._id, "send_messages")) {
                return;
            }
        }

        const messageData = {
            content,
            chat_id,
            is_private,
            sender,
            organization_id
        }

        if (reply_to) {
            messageData.reply_to = await mongoose.message.findById(reply_to);
        }

        if (is_private) {
            messageData.receiver = await mongoose.user.findOne({
                user_id: data.chat_id
            })
            // console.log("RECEIVER SET", messageData.receiver)
        }
        else {
            messageData.channel = await mongoose.channel.findOne({
                _id: Mongoose.Types.ObjectId(chat_id)
            })
        }

        if (data.files) {
            const files = data.files.map(async (file) => {
                return uploadFile(file);
            })
            messageData.files = await Promise.all(files);
        }

        // console.log('[FILES]', messageData.files);

        // console.log("MESSAGE DATA", JSON.stringify(messageData, null,));

        const message = await mongoose.message.create(messageData);

        message.update_history.push({
            content,
            updated_at: Date.now(),
        })

        await message.save();

        // TODO: Send message to receiver using socket.io or f

        if (is_private) {
            await mongoose.user.updateOne({
                user_id: socket.userId,
                "chat_rooms.chat_id": {
                    $ne: chat_id
                },
            },
                {
                    $push: {
                    chat_rooms: {
                        chat_id,
                        organization_id,
                    }
                }
                });
            await mongoose.user.updateOne({
                user_id: data.chat_id,
                "chat_rooms.chat_id": {
                    $ne: chat_id
                },
            },
                {
                    $push: {
                        chat_rooms: {
                            chat_id,
                            organization_id,
                        }
                    }
                });
            SOCKET_USERS[socket.userId].forEach(socket => {
                socket.join(chat_id)
            })
            if (SOCKET_USERS[data.chat_id])
                SOCKET_USERS[data.chat_id].forEach(socket => {
                    socket.join(chat_id)
                })
        }

        const createdMessage = await populateMessage(mongoose.message
            .findById(message._id))

        // console.log('[MESSAGE]', message);

        io.to(chat_id).emit("send-message", createdMessage);
    }
    catch (e) {
        console.log(e);
        return;
    }
}