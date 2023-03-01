import mongoose from "mongoose";
import syncES from "../helpers/syncES.js";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    is_private: {
        type: Boolean,
        required: true,
    },
    chat_id: {
        type: String,
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
    },
    content: {
        type: String,
    },
    files: {
        type: [{
            key: String,
            name: String,
            fileSize: Number,
            mimetype: String,
        },],
        default: [],
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    is_updated: {
        type: Boolean,
        default: false,
    },
    update_history: {
        type: [{
            content: String,
            updated_at: Date,
        }],
        default: [],
    },
    reactions: {
        type: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            reaction: {
                unicode: String,
                name: String,
            }
        }],
        default: [],
    },
    is_forwarded: {
        type: Boolean,
        default: false,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    read_by: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }],
        default: [],
    },
    starred_by: {
        type: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            message_type: {
                type: String,
                enum: ['IMPORTANT', 'TODO', 'NOTE', 'MANAGER', 'FOLLOWUP'],
            },
        }],
        default: [],
    },
    reply_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    organization_id: {
        type: String,
        required: true,
    },
});

messageSchema.post('save', async function (doc) {
    syncES.add({
        index: 'messages',
        id: doc._id,
        body: {
            id: doc._id,
            organization_id: doc.organization_id,
            chat_id: doc.chat_id,
            sender: doc.sender._id,
            receiver: doc.receiver ? doc.receiver._id : null,
            channel: doc.channel ? doc.channel._id : null,
            content: doc.content,
            files: doc.files,
            created_at: doc.created_at,
            is_deleted: doc.is_deleted,
            is_private: doc.is_private,
        },
        operation: 'create'
    })
})


messageSchema.post('update', async function () {
    const doc = await this.model.findOne(this._conditions)
    console.log("[update]", doc)
    syncES.add({
        index: 'messages',
        id: doc._id,
        body: {
            id: doc._id,
            organization_id: doc.organization_id,
            chat_id: doc.chat_id,
            sender: doc.sender._id,
            receiver: doc.receiver ? doc.receiver._id : null,
            channel: doc.channel ? doc.channel._id : null,
            content: doc.content,
            files: doc.files,
            created_at: doc.created_at,
            is_deleted: doc.is_deleted,
            is_private: doc.is_private,
        },
        operation: 'update'
    })
})

messageSchema.post('updateOne', async function () {
    const doc = await this.model.findOne(this._conditions)
    console.log("[updateOne]", doc)
    syncES.add({
        index: 'messages',
        id: doc._id,
        body: {
            id: doc._id,
            organization_id: doc.organization_id,
            chat_id: doc.chat_id,
            sender: doc.sender._id,
            receiver: doc.receiver ? doc.receiver._id : null,
            channel: doc.channel ? doc.channel._id : null,
            content: doc.content,
            files: doc.files,
            created_at: doc.created_at,
            is_deleted: doc.is_deleted,
            is_private: doc.is_private,
        },
        operation: 'update'
    })
})

messageSchema.post('findOneAndUpdate', async function () {
    const doc = await this.model.findOne(this._conditions)
    console.log("[findOneAndUpdate]", doc)
    syncES.add({
        index: 'messages',
        id: doc._id,
        body: {
            id: doc._id,
            organization_id: doc.organization_id,
            chat_id: doc.chat_id,
            sender: doc.sender._id,
            receiver: doc.receiver ? doc.receiver._id : null,
            channel: doc.channel ? doc.channel._id : null,
            content: doc.content,
            files: doc.files,
            created_at: doc.created_at,
            is_deleted: doc.is_deleted,
            is_private: doc.is_private,
        },
        operation: 'update'
    })
})

// messageSchema.post('updateMany', async function (doc) {
//     syncES.add({
//         index: 'messages',
//         id: doc._id,
//         body: {
//             id: doc._id,
//             organization_id: doc.organization_id,
//             chat_id: doc.chat_id,
//             sender: doc.sender._id,
//             receiver: doc.receiver ? doc.receiver._id : null,
//             channel: doc.channel ? doc.channel._id : null,
//             content: doc.content,
//             files: doc.files,
//             created_at: doc.created_at,
//             is_deleted: doc.is_deleted,
//             is_private: doc.is_private,
//         },
//         operation: 'update'
//     })
// })

messageSchema.post('remove', async function (doc) {
    syncES.add({
        index: 'messages',
        id: doc._id,
        operation: 'delete'
    })
})


export default mongoose.model("Message", messageSchema);
