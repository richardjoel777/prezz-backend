import auth from "../middlewares/auth.js";

import {
    acceptInvite,
    createInvite,
    declineInvite,
    getContacts,
    getInvites,
    removeContact
} from "../controllers/contacts/index.js"

export default async (fastify, opts, done) => {
    fastify.post("/accept", { preHandler: auth }, acceptInvite);
    fastify.post("/create", { preHandler: auth }, createInvite);
    fastify.post("/decline", { preHandler: auth }, declineInvite);
    fastify.post("/get", { preHandler: auth }, getContacts);
    fastify.get("/getInvites", { preHandler: auth }, getInvites);
    fastify.post("/remove", { preHandler: auth }, removeContact);
    done();
}