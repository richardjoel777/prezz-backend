import mongoose from "mongoose";
import { uuid } from "uuidv4";

import syncES from "../helpers/syncES.js";

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image_url: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    visibility: {
        type: Boolean,
        default: false,
        required: true
    },
    type: {
        type: String,
        enum: ['PUBLIC', 'PRIVATE', 'EXTERNAL'],
        required: true
    },
    organization_id: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    members: {
        type: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            role: {
                type: String,
                enum: ['SUPERUSER', 'ADMIN', 'MODERATOR', 'MEMBER'],
                default: 'MEMBER',
            }
        }],
        default: [],
        required: true
    },
    permissions: {
        type: [{
            role: String,
            permissions: {
                edit_channel_info: Boolean,
                add_participants: Boolean,
                remove_participants: Boolean,
                clear_all_messages: Boolean,
                archive_channel: Boolean,
                delete_channel: Boolean,
                send_messages: Boolean,
                reply_in_thread: Boolean,
                mention_users: Boolean,
                leave_channel: Boolean,
                host_broadcast: Boolean,
                delete_others_messages: Boolean,
                delete_message: Boolean,
                edit_message: Boolean,
                start_stop_meeting: Boolean,
                pin_messages: Boolean,
                all_available_mentions: Boolean,
            }
        }],
        default: [
            {
                role: 'SUPERUSER',
                permissions: {
                    edit_channel_info: true,
                    add_participants: true,
                    remove_participants: true,
                    clear_all_messages: true,
                    archive_channel: true,
                    delete_channel: true,
                    send_messages: true,
                    reply_in_thread: true,
                    mention_users: true,
                    leave_channel: true,
                    host_broadcast: true,
                    delete_others_messages: true,
                    delete_message: true,
                    edit_message: true,
                    start_stop_meeting: true,
                    pin_messages: true,
                    all_available_mentions: true,
                }
            },
            {
                role: 'ADMIN',
                permissions: {
                    edit_channel_info: true,
                    add_participants: true,
                    remove_participants: true,
                    clear_all_messages: true,
                    archive_channel: true,
                    delete_channel: true,
                    send_messages: true,
                    reply_in_thread: true,
                    mention_users: true,
                    leave_channel: true,
                    host_broadcast: true,
                    delete_others_messages: true,
                    delete_message: true,
                    edit_message: true,
                    start_stop_meeting: true,
                    pin_messages: true,
                    all_available_mentions: true,
                }
            },
            {
                role: 'MODERATOR',
                permissions: {
                    edit_channel_info: true,
                    add_participants: true,
                    remove_participants: true,
                    clear_all_messages: false,
                    archive_channel: false,
                    delete_channel: false,
                    send_messages: true,
                    reply_in_thread: true,
                    mention_users: true,
                    leave_channel: true,
                    host_broadcast: true,
                    delete_others_messages: false,
                    delete_message: true,
                    edit_message: true,
                    start_stop_meeting: true,
                    pin_messages: true,
                    all_available_mentions: true,
                },
            },
            {
                role: 'MEMBER',
                permissions: {
                    edit_channel_info: false,
                    add_participants: true,
                    remove_participants: false,
                    clear_all_messages: false,
                    archive_channel: false,
                    delete_channel: false,
                    send_messages: true,
                    reply_in_thread: true,
                    mention_users: true,
                    leave_channel: true,
                    host_broadcast: true,
                    delete_others_messages: false,
                    delete_message: true,
                    edit_message: true,
                    start_stop_meeting: true,
                    pin_messages: true,
                    all_available_mentions: true,
                }
            }
        ]
    },
    reply_mode: {
        type: String,
        enum: ['NORMAL', 'THREAD'],
        default: 'THREAD',
    },
    notify_user_join_leave: {
        type: Boolean,
        default: false,
    },
    notify_user_add_remove: {
        type: Boolean,
        default: true,
    },
    chat_id: {
        type: String,
        default: uuid,
        required: true
    },
    pinned_message: {
        type: {
            message: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "message",
            },
            pinned_by: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            expires_at: {
                type: Date,
            }
        }
    },
    is_archived: {
        type: Boolean,
        default: false,
    },
})

channelSchema.post('save', async function (doc) {
    syncES.add({
        index: 'channels',
        id: doc._id,
        body: {
            name: doc.name,
            description: doc.description,
            image_url: doc.image_url,
            created_at: doc.created_at,
            visibility: doc.visibility,
            type: doc.type,
            organization_id: doc.organization_id,
            id: doc._id,
            members: doc.members.map(member => {
                return {
                    user: member.user._id,
                    role: member.role,
                }
            }),
        },
        operation: 'create'
    })
})

channelSchema.post('update', async function () {
    const doc = await this.model.findOne(this._conditions)
    console.log("update", doc)
    syncES.add({
        index: 'channels',
        id: doc._id,
        body: {
            name: doc.name,
            description: doc.description,
            image_url: doc.image_url,
            created_at: doc.created_at,
            visibility: doc.visibility,
            type: doc.type,
            organization_id: doc.organization_id,
            id: doc._id,
            members: doc.members.map(member => {
                return {
                    user: member.user._id,
                    role: member.role,
                }
            }),
        },
        operation: 'update'
    })
})

channelSchema.post('updateOne', async function () {
    const doc = await this.model.findOne(this._conditions)
    console.log("updateOne", doc)
    syncES.add({
        index: 'channels',
        id: doc._id,
        body: {
            name: doc.name,
            description: doc.description,
            image_url: doc.image_url,
            created_at: doc.created_at,
            visibility: doc.visibility,
            type: doc.type,
            organization_id: doc.organization_id,
            id: doc._id,
            members: doc.members.map(member => {
                return {
                    user: member.user._id,
                    role: member.role,
                }
            }),
        },
        operation: 'update'
    })
})

channelSchema.post('findOneAndUpdate', async function () {
    const doc = await this.model.findOne(this._conditions)
    console.log("findOneAndUpdate", doc)
    syncES.add({
        index: 'channels',
        id: doc._id,
        body: {
            name: doc.name,
            description: doc.description,
            image_url: doc.image_url,
            created_at: doc.created_at,
            visibility: doc.visibility,
            type: doc.type,
            organization_id: doc.organization_id,
            id: doc._id,
            members: doc.members.map(member => {
                return {
                    user: member.user._id,
                    role: member.role,
                }
            }),
        },
        operation: 'update'
    })
})

// channelSchema.post('updateMany', async function (docs) {
//     docs.forEach(doc => {
//         syncES.add({
//             index: 'channels',
//             id: doc._id,
//             body: {
//                 name: doc.name,
//                 description: doc.description,
//                 image_url: doc.image_url,
//                 created_at: doc.created_at,
//                 visibility: doc.visibility,
//                 type: doc.type,
//                 organization_id: doc.organization_id,
//                 id: doc._id,
//                 members: doc.members.map(member => {
//                     return {
//                         user: member.user._id,
//                         role: member.role,
//                     }
//                 }),
//             },
//             operation: 'update'
//         })
//     })
// })

channelSchema.post('remove', async function (doc) {
    syncES.add({
        index: 'channels',
        id: doc._id,
        operation: 'delete'
    })
})

export default mongoose.model("Channel", channelSchema);