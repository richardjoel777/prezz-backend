import mongoose from '../init/mongoose.js';
import Mongoose from 'mongoose'
import { addReactions, populateMessage, validatePermission } from './index.js';

export default async (socket, io, data) => {
    const { id, content } = data;

    console.log("Edit message", data);

    try {
        const message = await populateMessage(mongoose.message
            .findById(id))

        if (!message.is_private) {
            if (!validatePermission(socket, new Mongoose.Types.ObjectId(message.chat_id), "edit_message")) {
                return;
            }
        }

        message.content = content;
        message.is_updated = true;
        message.update_history.push({
            content: content,
            updated_at: Date.now(),
        });

        await message.save();

        const messageData = addReactions([message])[0];

        console.log("Edit message", messageData);

        io.to(message.chat_id).emit('edit-message', messageData);

    } catch (error) {
        console.log("[ERROR]", error);
        return;
    }
}