import jwt from 'jsonwebtoken';
import { SOCKET_USERS } from '../server.js';

export default (socket, next) => {
    // console.log(socket.handshake.query, " MIDDLEWARE");
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.userId = decoded.id;
            socket.notificationToken = socket.handshake.query.notificationToken;
            // console.log("Decoded", decoded);
            SOCKET_USERS[socket.userId] = [...SOCKET_USERS[socket.userId] || [], socket];
            next();
        });
    }
    else {
        console.log("No token");
        next(new Error('Authentication error'));
    }
}