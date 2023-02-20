import auth from "../middlewares/auth.js";
import chatControllers from "../controllers/chats/index.js";

const {
    getFiles,
    getSentMessages,
    getUnreadCount,
    getChatUser,
    getPinnedChats,
    getConversations,
    getProfileandLastMessage
} = chatControllers;

export default async (fastify, opts, done) => {
    fastify.post("/get-files", { preHandler: auth, handler: getFiles });
    fastify.post("/sent-messages", { preHandler: auth, handler: getSentMessages });
    fastify.post("/unread-count", { preHandler: auth, handler: getUnreadCount });
    fastify.post('/chat-user', { preHandler: auth, handler: getChatUser })
    fastify.post('/pinned-chats', { preHandler: auth, handler: getPinnedChats })
    fastify.post('/conversations', { preHandler: auth, handler: getConversations })
    fastify.post('/get-profile', { preHandler: auth, handler: getProfileandLastMessage })
    done();
}