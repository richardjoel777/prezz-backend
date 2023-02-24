import createChannel from "./createChannel.js";
import editChannel from "./editChannel.js";
import editPermissions from "./editPermissions.js";
import addMembers from "./addMembers.js";
import removeMember from "./removeMember.js";
import joinChannel from "./joinChannel.js";
import leaveChannel from "./leaveChannel.js";
import getChannels from "./getChannels.js";
import getChannel from "./getChannel.js";
import getMembers from "./getMembers.js";
import toggleArchiveChannel from "./toggleArchiveChannel.js";
import getOrgChannels from "./getOrgChannels.js";

import mongoose from "../../init/mongoose.js";

export {
    createChannel,
    editChannel,
    editPermissions,
    addMembers,
    removeMember,
    joinChannel,
    leaveChannel,
    getChannels,
    getChannel,
    getMembers,
    toggleArchiveChannel,
    getOrgChannels,
}

export const validatePermission = async (req, res, channelId, permission) => {
    const channel = await mongoose.channel.findById(channelId).populate({
        path: "members.user",
        select: {
            user_id: 1,
        }
    });
    if (!channel) {
        res.code(404).send({ message: "Channel not found" });
        return false;
    }

    const member = channel.members.find(member => member.user.user_id === req.userId);

    console.log("MEMBER", member);

    if (channel.permissions.find(permission => permission.role === member.role).permissions[permission] === false) {
        console.log("NOT ALLOWED");
        res.code(403).send({ message: "You are not authorized to perform this action" });
        return false;
    }

    return true;
}