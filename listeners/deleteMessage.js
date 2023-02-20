import mongoose from '../init/mongoose.js';
import { populateMessage, validatePermission } from './index.js';

export default async (socket, io, data) => {
    try {
        const { id } = data;

        const message = await populateMessage(mongoose.message
            .findById(id))

        if ((message.is_private && message.sender.id !== socket.userId) || message.is_deleted) {
            return;
        }

        if (!message.is_private) {
            if (message.sender.user_id === socket.userId) {
                if (!validatePermission(socket, message.chat_id, "delete_own_messages")) {
                    return;
                }
            }
            else {
                if (!validatePermission(socket, message.chat_id, "delete_messages")) {
                    return;
                }
            }
        }

        message.is_deleted = true;
        message.content = "This message was deleted";
        message.deleted_at = new Date();

        await message.save();

        io.to(message.chat_id).emit('delete-message', message);

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal server error' });
    }
}