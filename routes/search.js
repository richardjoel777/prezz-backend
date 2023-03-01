import auth from "../middlewares/auth.js";

import {
    channel,
    user,
    getFreqContacts,
    message,
    multiSearch
} from "../controllers/search/index.js"

export default async (fastify, opts, done) => {
    fastify.post("/channel", { preHandler: [auth], handler: channel });
    fastify.post("/user", { preHandler: [auth], handler: user });
    fastify.post("/message", { preHandler: [auth], handler: message });
    fastify.post("/frequent-contacts", { preHandler: [auth], handler: getFreqContacts });
    fastify.post("/multi-search", { preHandler: [auth], handler: multiSearch });
    done();
}