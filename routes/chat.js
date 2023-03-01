import auth from "../middlewares/auth.js";

import {
    getFiles,
    getSentMessages,
    getUnreadCount,
    getChatUser,
    getPinnedChats,
    getConversations,
    getProfileandLastMessage,
    getConversationHistory,
    getRecentMessages
} from "../controllers/chats/index.js"

export default async (fastify, opts, done) => {
    fastify.post("/get-files", { preHandler: auth, handler: getFiles });
    fastify.post("/sent-messages", { preHandler: auth, handler: getSentMessages });
    fastify.post("/unread-count", { preHandler: auth, handler: getUnreadCount });
    fastify.post('/chat-user', { preHandler: auth, handler: getChatUser })
    fastify.post('/pinned-chats', { preHandler: auth, handler: getPinnedChats })
    fastify.post('/conversations', { preHandler: auth, handler: getConversations })
    fastify.post('/get-profile', { preHandler: auth, handler: getProfileandLastMessage })
    fastify.post('/conversation-history', { preHandler: auth, handler: getConversationHistory })
    fastify.post('/recent-messages', { preHandler: auth, handler: getRecentMessages })
    done();
}