import mongoose from '../init/mongoose.js';
import { addReactions, populateMessage, validatePermission } from './index.js';

export default async (socket, io, data) => {
    const { id, content } = data;

    try {
        const message = await populateMessage(mongoose.message
            .findById(id))

        if (!message.is_private) {
            if (validatePermission(socket, message.chat_id, "edit_message")) {
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

        io.to(message.chat_id).emit('edit-message', messageData);

    } catch (e) {
        console.log(e);
        return;
    }
}