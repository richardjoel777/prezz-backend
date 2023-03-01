import auth from '../middlewares/auth.js';
import upload from '../config/multer.js';
import { validateEditPermissions } from '../middlewares/validators.js'

import * as channelControllers from '../controllers/channel/index.js';

const routes = async (fastify, options, done) => {
    // fastify.get('/channels', channelControllers.getChannels);
    // fastify.get('/channel/:id', channelControllers.getChannel);
    fastify.post("/media", { preHandler: [auth], handler: channelControllers.getMediaFiles });
    fastify.post('/create-channel', { preHandler: [auth, upload.single('file')], handler: channelControllers.createChannel });
    fastify.post('/edit-channel/:id', { preHandler: [auth, upload.single('file')], handler: channelControllers.editChannel });
    fastify.post('/edit-permissions/:id', { preHandler: [auth, validateEditPermissions], handler: channelControllers.editPermissions })
    fastify.post('/add-members', { preHandler: auth, handler: channelControllers.addMembers })
    fastify.post('/remove-member', { preHandler: auth, handler: channelControllers.removeMember })
    fastify.post('/join-channel', { preHandler: auth, handler: channelControllers.joinChannel })
    fastify.post('/leave-channel', { preHandler: auth, handler: channelControllers.leaveChannel })
    fastify.post('/get-channels', { preHandler: auth, handler: channelControllers.getChannels })
    fastify.get('/get-channel/:id', { preHandler: auth, handler: channelControllers.getChannel })
    fastify.post('/members', { preHandler: auth, handler: channelControllers.getMembers })
    fastify.post('/archive', { preHandler: auth, handler: channelControllers.toggleArchiveChannel })
    fastify.post('/get-org-channels', { preHandler: auth, handler: channelControllers.getOrgChannels })
    done();
}

export default routes;