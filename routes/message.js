import messageControllers from '../controllers/message/index.js';
import auth from '../middlewares/auth.js';
import upload from '../config/multer.js';

const {
    starMessage,
    getStarredMessages,
    setOrgId
} = messageControllers;

const routes = async (fastify, options, done) => {
    fastify.post('/star-message', { preHandler: auth, handler: starMessage });
    fastify.get('/star-message', { preHandler: auth, handler: getStarredMessages });
    fastify.post('/set-org-id', { preHandler: auth, handler: setOrgId });
    done();
}

export default routes;