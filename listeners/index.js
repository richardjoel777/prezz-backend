import handleConnection from "./handleConnection.js"
import createMessage from "./createMessage.js"
import fetchMessages from "./fetchMessage.js"
import deleteMessage from "./deleteMessage.js"
import editMessage from "./editMessage.js"
import reactMessage from "./reactmessage.js"
import readMessage from "./readMessage.js"
import editPermissions from "./editPermissions.js"
import pinMessage from "./pinMessage.js"
import unpinMessage from "./unpinMessage.js"
import sendNotification from "./sendNotification.js"
import addPinnedChat from "./addPinnedChat.js"
import removePinnedChat from "./removePinnedChat.js"

export default {
    handleConnection,
    createMessage,
    fetchMessages,
    deleteMessage,
    editMessage,
    reactMessage,
    readMessage,
    editPermissions,
    pinMessage,
    unpinMessage,
    sendNotification,
    addPinnedChat,
    removePinnedChat,
}

export const addReactions = (messages) => {
    const messagesData = [];

    // console.log(JSON.stringify(messages, null, 2));

    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const reactionsData = {};
        for (let j = 0; j < message.reactions.length; j++) {
            const react = `${message.reactions[j].reaction.unicode}:${message.reactions[j].reaction.name}`
            if (reactionsData[react]) {
                reactionsData[react].push(message.reactions[j].user);
            } else {
                reactionsData[react] = [message.reactions[j].user];
            }
        }
        messagesData[i] = {
            ...message._doc,
            reactions: reactionsData,
        }
    }

    return messagesData;
}

export const populateMessage = (messageQuery) => {
    return messageQuery
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
            path: "read_by",
            select: {
                user_id: 1,
                first_name: 1,
                last_name: 1,
                email: 1,
                mini_avatar_url: 1,
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
        })
}

export const validatePermission = async (socket, channelId, permission) => {
    const channel = await mongoose.channel.findOne({
        channel_id: channelId,
    }).populate({
        path: "members.user",
        select: {
            user_id: 1,
        }
    });
    if (!channel) {
        socket.emit("error", "Channel not found");
        return false;
    }

    const member = channel.members.find(member => member.user.user_id === socket.userId);

    if (channel.permissions.find(permission => permission.role === member.role).permissions[permission] === false) {
        socket.emit("error", "You don't have permission to do this action");
        return false;
    }

    return true;
}