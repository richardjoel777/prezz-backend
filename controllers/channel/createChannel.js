import Joi from "joi";
import prisma from "../../init/prisma.js";
import mongoose from "../../init/mongoose.js";
import { SOCKET_USERS } from "../../server.js";
import uploadProfilePic from "../../helpers/uploadProfilePic.js";

const organizationSchema = Joi.object({
    name: Joi.string().required(),
    organization_id: Joi.string().required(),
    description: Joi.string(),
    visibility: Joi.boolean(),
    type: Joi.string().required(),
    image_url: Joi.string(),
    participants_list: Joi.array().items(Joi.string()),
})

export default async (req, res) => {

    const data = JSON.parse(req.body.data);

    try {
        await Joi.attempt(data, organizationSchema);
    }
    catch (err) {
        return res.code(400).send({ message: err.message });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                id: req.userId,
            }
        })

        const userProfile = await mongoose.user.findOne({
            user_id: req.userId
        })

        const organization = await prisma.organization.findUnique({
            where: {
                id: data.organization_id
            }
        })

        if (!organization || !user) {
            return res.code(404).send({ message: "Organization not found" });
        }

        if ((data.type === "EXTERNAL" && user.id !== organization.owner_id)) {
            return res.code(403).send({ message: "You are not authorized to create a channel in this Channel" });
        }

        const participants_list = data.participants_list || [];

        const channelData = structuredClone(data);

        delete channelData.participants_list;

        const members = await Promise.all(participants_list.map(async (user_id) => {
            const user = await mongoose.user.findOne({
                user_id
            })
            return {
                user,
                role: "MEMBER"
            }
        })) || [];

        if (req.file) {
            console.log("FILE", req.file);
            channelData.image_url = await uploadProfilePic(req.file);
        }

        const channelDetails = {
            ...channelData,
            owner: userProfile,
            members: [{
                user: userProfile,
                role: "SUPERUSER"
            },
                ...members
            ],
        }


        const channel = await mongoose.channel.create(channelDetails)

        await mongoose.user.updateOne({
            user_id: user.id
        }, {
            $push: {
                chat_rooms: {
                    chat_id: channel._id,
                    organization_id: channel.organization_id,
                },
            }
        })

        if (SOCKET_USERS[user.id]) {
            SOCKET_USERS[user.id].forEach(socket => {
                socket.join(channel._id);
            })
        }
        if (participants_list) {

            await Promise.all(participants_list.map(async (user_id) => {
                await mongoose.user.updateOne({
                    user_id
                }, {
                    $push: {
                        chat_rooms: {
                            chat_id: channel._id,
                            organization_id: channel.organization_id,
                        }
                    }
                })
            }))

            participants_list.forEach(user_id => {
                if (SOCKET_USERS[user_id]) {
                    SOCKET_USERS[user_id].forEach(socket => {
                        socket.join(channel._id);
                    })
                }
            })
        }

        res.code(201).send({ message: "Channel Created successfully", channel });
    } catch (err) {
        console.log(err);
        res.code(500).send({ message: "Internal server error" });
    }
};