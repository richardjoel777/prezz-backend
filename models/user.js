import mongoose from "mongoose";

import syncES from "../helpers/syncES.js";

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
    image_url: {
        type: String,
        default: "profile/profile_placeholder.png",
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'BUSY', 'AWAY', 'INVISIBLE'],
        default: 'AVAILABLE',
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

userSchema.post("save", async function (doc) {
    console.log("save", doc);
    syncES.add({
        index: "users",
        id: doc._id,
        body: {
            user_id: doc.user_id,
            first_name: doc.first_name,
            last_name: doc.last_name,
            image_url: doc.image_url,
            email: doc.email,
            id: doc._id,
        },
        operation: "create"
    })
});

userSchema.post("update", async function () {
    const doc = await this.model.findOne(this._conditions)
    console.log("update", doc);
    syncES.add({
        index: "users",
        id: doc._id,
        body: {
            user_id: doc.user_id,
            first_name: doc.first_name,
            last_name: doc.last_name,
            image_url: doc.image_url,
            email: doc.email,
            id: doc._id,
        },
        operation: "update"
    })
});

userSchema.post("updateOne", async function () {
    const doc = await this.model.findOne(this._conditions)
    console.log("updateOne", doc);
    syncES.add({
        index: "users",
        id: doc._id,
        body: {
            user_id: doc.user_id,
            first_name: doc.first_name,
            last_name: doc.last_name,
            image_url: doc.image_url,
            email: doc.email,
            id: doc._id,
        },
        operation: "update"
    })
});

userSchema.post("findOneAndUpdate", async function () {
    const doc = await this.model.findOne(this._conditions)
    console.log("findOneAndUpdate", doc);
    syncES.add({
        index: "users",
        id: doc._id,
        body: {
            user_id: doc.user_id,
            first_name: doc.first_name,
            last_name: doc.last_name,
            image_url: doc.image_url,
            email: doc.email,
            id: doc._id,
        },
        operation: "update"
    })
});

// userSchema.post("updateMany", async function (docs) {
//     // console.log("updateMany", docs);
//     docs.forEach((doc) => {
//         syncES.add({
//             index: "users",
//             id: doc._id,
//             body: {
//                 user_id: doc.user_id,
//                 first_name: doc.first_name,
//                 last_name: doc.last_name,
//                 image_url: doc.image_url,
//                 email: doc.email,
//                 id: doc._id,
//             },
//             operation: "update"
//         })
//     })
// });

// userSchema.post("deleteMany", async function (doc) {
//     syncES.add({
//         index: "users",
//         id: doc._id,
//         operation: "delete"
//     })
// });

const user = mongoose.model("user", userSchema);

export default user;