import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
        alias: "id",
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        default: "",
    },
    avatar_url: {
        type: String,
        default: `${process.env.ASSESTS_ENDPOINT}/dp_placeholder.png`,
    },
    mini_avatar_url: {
        type: String,
        default: `${process.env.ASSESTS_ENDPOINT}/dp_placeholder.png`,
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'BUSY', 'AWAY', 'INVISIBLE'],
        default: 'AVAILABLE',
    },
    avatar_url: {
        type: String,
        default: `${process.env.ASSESTS_ENDPOINT}/dp_placeholder.png`,
    },
    mini_avatar_url: {
        type: String,
        default: `${process.env.ASSESTS_ENDPOINT}/dp_placeholder.png`,
    },
    phone_work: {
        type: String,
    },
    phone_personal: {
        type: String,
    },
    designation: {
        type: String,
    },
    department: {
        type: String,
    },
    reporting_to: {
        type: String,
    },
    seating_location: {
        type: String,
    },
    employee_id: {
        type: String,
    },
    country: {
        type: String,
        default: "India",
    },
    timezone: {
        type: String,
        default: "Asia/Kolkata",
    },
    language: {
        type: String,
        default: "english",
    },
    email: {
        type: String,
        required: true,
    },
    // star_messages: {
    //     type: [{
    //         message: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: "message",
    //         },
            
    //     }],
    //     default: [],
    // },
    chat_rooms: {
        type: [{
            chat_id: String,
            organization_id: String,
        }],
        default: [],
    },
    contacts: {
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user",
                },
                organization_id: String,
            }
        ],
        default: [],
    },
    pinned_chats: {
        type: [{
            chat_id: String,
            chat_type: {
                type: String,
                enum: ['CHANNEL', 'PRIVATE'],
            },
            channel: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Channel"
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            organization_id: String,
        }],
        default: [],
    },
});

const user = mongoose.model("user", userSchema);

export default user;