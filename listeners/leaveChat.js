import mongoose from "../db/mongoose.js";
import { SOCKET_USERS } from "../server.js";

export default async (socket, io, data) => {
    try {
        const sockets = SOCKET_USERS[data.userId];
        if (sockets) {
            sockets.forEach(s => {
                if (s.id !== socket.id)
                    s.emit("leave-chat", data);
            })
        }
    }
    catch (err) {
        console.log(err);
    }
}