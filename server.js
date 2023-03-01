import fastify from "fastify";


import cors from '@fastify/cors'
import cookies from '@fastify/cookie'
import fastifyIO from 'fastify-socket.io';
import fastifymulter from 'fastify-multer'


import authRoutes from './routes/auth.js'
import organizationRoutes from './routes/organization.js'
import channelRoutes from './routes/channel.js'
import messageRoutes from './routes/message.js'
import chatRoutes from './routes/chat.js'
import searchRoutes from "./routes/search.js";
import contactRoutes from "./routes/contact.js";

import getDailyQuote from "./controllers/general/quote.js";
import getMetrics from './controllers/general/metrics.js'

import socketMiddleware from "./middlewares/socket.js";
import socketRoutes from "./routes/socket.js";
import connectMongodb from "./init/mongodb.js";
import setImageUrl from "./controllers/general/setImageUrl.js";
import populator from "./controllers/es/populator.js";
import setRedis from "./controllers/general/setRedis.js";

const server = fastify({
    logger: true,
});

server.register(fastifyIO, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
    path: '/api/socket.io',
    transports: ['websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling',
        'polling'],
    allowEIO3: true,

});

server.register(fastifymulter.contentParser);

server.register(cookies, {
    secret: process.env.COOKIE_SECRET
})

server.register(authRoutes, {
    prefix: '/api/auth',
});

await server.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "X-Requested-With", "Accept"],
    // credentials: true,
})

server.addHook('preHandler', async (request, reply) => {
    // console.log("preHandler");
    request.io = server.io;
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
})

server.register(organizationRoutes, {
    prefix: '/api/organization',
});

server.register(channelRoutes, {
    prefix: '/api/channel',
})

server.register(messageRoutes, {
    prefix: '/api/message',
})

server.register(chatRoutes, {
    prefix: '/api/chat',
})

server.register(contactRoutes, {
    prefix: '/api/contact',
})

server.register(searchRoutes, {
    prefix: '/api/search',
})

server.get('/', async (request, reply) => {
    return "Server is up and running";
});

server.get('/api/set-image', setImageUrl)

server.get('/api/populate', populator)

server.get('/api/quote', getDailyQuote);

server.get('/api/set-user', setRedis)



server.get('/metrics', getMetrics)


export const SOCKET_USERS = {}

const start = async () => {
    try {
        await server.listen({ port: 6969, host: "0.0.0.0" });
        server.log.info(`server listening on ${server.server.address().port}`);
        server.io.use(socketMiddleware);
        server.ready().then(() => {
            server.io.on('connection', socketRoutes);
        })
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

connectMongodb()

start();

export const io = server.io