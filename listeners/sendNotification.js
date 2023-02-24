import mongoose from "../init/mongoose.js";
import messaging from '../init/firebase.js'

export default async (socket, io, data) => {
    const { token, id } = data;

    // console.log("EMITTED NOTIFICATION", data)

    let title

    try {

        const message = await mongoose.message.findById(id)
            .populate({
                path: "sender",
                select: {
                    first_name: true,
                    last_name: true
                }
            })
            .select({
                content: true,
                files: true,
                is_private: true,
                chat_id: true,
                sender: true,
            })

        if (message.is_private) {
            title = message.sender.first_name + " " + message.sender.last_name
        }
        else {
            const channel = await mongoose.channel.findById(message.chat_id).select({
                name: true
            })
            title = channel.name
        }

        const body = message.content ? message.content : "[FILE] : " + message.files[0].name

        const response = await messaging.sendToDevice(token, {
            notification: {
                title,
                body
            }
        })

        // console.log("Successful Messages Sent", response.successCount)
        // console.log("UnSuccessful Messages Sent", response.failureCount)

    }
    catch (error) {
        console.log(error)
        return;
    }


}