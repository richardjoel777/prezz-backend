import auth from "../middlewares/auth.js";
import searchControllers from "../controllers/search/index.js";

const {
    channel,
    media,
    message,
} = searchControllers;

export default async (fastify, opts, done) => {
    fastify.post("/channel", { preHandler: [auth], handler: channel });
    fastify.post("/media", { preHandler: [auth], handler: media });
    fastify.post("/message", { preHandler: [auth], handler: message });
    done();
}