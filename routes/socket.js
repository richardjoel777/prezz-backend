import listeners from '../listeners/index.js'
import { io, SOCKET_USERS } from '../server.js'

const {
    handleConnection,
    createMessage,
    fetchMessages,
    deleteMessage,
    editMessage,
    reactMessage,
    readMessage,
    editPermissions,
    pinMessage,
    unpinMessage,
    sendNotification,
    addPinnedChat,
    removePinnedChat,
    // unreactMessage
} = listeners

export default async (socket) => {

    await handleConnection(socket)

    socket.on('create-message', async (data) => {
        await createMessage(socket, io, data)
    })

    socket.on('fetch-message', async (data) => {
        await fetchMessages(socket, io, data)
    })

    socket.on('delete-message', async (data) => {
        await deleteMessage(socket, io, data)
    })

    socket.on('react-message', async (data) => {
        await reactMessage(socket, io, data)
    })

    socket.on('read-message', async (data) => {
        await readMessage(socket, io, data)
    })

    socket.on('pinned-message', async (data) => {
        await pinMessage(socket, io, data)
    })

    socket.on('unpinned-message', async (data) => {
        await unpinMessage(socket, io, data)
    })

    socket.on("send-notification", async (data) => {
        await sendNotification(socket, io, data);
    })

    // socket.on('unreact-message', async (data) => {
    //     await unreactMessage(socket, io, data)
    // })

    socket.on('edit-message', async (data) => {
        await editMessage(socket, io, data)
    })

    socket.on('edit-permissions', async (data) => {
        await editPermissions(socket, io, data)
    })

    socket.on('pin-chat', async (data) => {
        await addPinnedChat(socket, io, data)
    })

    socket.on('unpin-chat', async (data) => {
        await removePinnedChat(socket, io, data)
    })


    socket.on('disconnect', () => {
        console.log('user disconnected');
        SOCKET_USERS[socket.userId] = SOCKET_USERS[socket.userId].filter(s => s.id !== socket.id)
    }
    )

}