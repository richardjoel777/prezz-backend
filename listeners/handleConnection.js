import mongoose from "../init/mongoose.js";

export default async (socket, io) => {
    const chatRooms = (await mongoose.user.findOne({ user_id: socket.userId }, {
        chat_rooms: 1,
    })).chat_rooms;

    const rooms = [...chatRooms.map(room => room.chat_id), socket.userId];

    socket.join(rooms);
    console.log("Joined", rooms);
}