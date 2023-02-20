import mongoose from "mongoose";

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

export default mongoose.model("Message", messageSchema);
