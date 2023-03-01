import auth from '../middlewares/auth.js';

import {
    starMessage,
    getStarredMessages,
    setOrgId,
    setChannel,
} from '../controllers/message/index.js';

const routes = async (fastify, options, done) => {
    fastify.post('/star-message', { preHandler: auth, handler: starMessage });
    fastify.get('/star-message', { preHandler: auth, handler: getStarredMessages });
    fastify.post('/set-org-id', { preHandler: auth, handler: setOrgId });
    fastify.post('/set-channel', { preHandler: auth, handler: setChannel });
    done();
}

export default routes;