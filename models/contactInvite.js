import mongoose from "mongoose";

const contactInviteSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    organization_id: {
        type: String,
        required: true
    },
});

const contactInvite = mongoose.model("contactInvite", contactInviteSchema);

export default contactInvite;