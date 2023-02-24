import auth from "../middlewares/auth.js";

import {
    channel,
    media,
    message,
} from "../controllers/search/index.js"

export default async (fastify, opts, done) => {
    fastify.post("/channel", { preHandler: [auth], handler: channel });
    fastify.post("/media", { preHandler: [auth], handler: media });
    fastify.post("/message", { preHandler: [auth], handler: message });
    done();
}