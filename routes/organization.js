import organizationControllers from "../controllers/organization/index.js";
import auth from "../middlewares/auth.js"

const {
    createOrganization,
    createInvitation,
    getInvitation,
    updateOrganization,
    deleteOrganization,
    checkOrganization,
    getMembers,
    getUserOrganizations,
    joinOrganization,
    setDefaultOrganization,
    getDefaultOrg,
    getMember
} = organizationControllers;

export default async (fastify, opts, done) => {
    fastify.post("/create", { preHandler: [auth], handler: createOrganization });
    fastify.post("/invite", { preHandler: [auth], handler: createInvitation });
    fastify.get("/invite/:invitation_id", { handler: getInvitation });
    fastify.post("/update/:id", { preHandler: [auth], handler: updateOrganization });
    fastify.delete("/delete/:id", { preHandler: [auth], handler: deleteOrganization });
    fastify.post("/check", { handler: checkOrganization });
    fastify.post("/members", { preHandler: [auth], handler: getMembers });
    fastify.get('/user-organizations', { preHandler: [auth], handler: getUserOrganizations })
    fastify.post('/set-default', { preHandler: [auth], handler: setDefaultOrganization })
    fastify.get('/default', { preHandler: [auth], handler: getDefaultOrg })
    fastify.post('/join', { preHandler: [auth], handler: joinOrganization })
    fastify.post('/member', { preHandler: [auth], handler: getMember })
    done();
}