import Joi from "joi";
import prisma from "../../init/prisma.js";
import mongoose from "../../init/mongoose.js";
import { SOCKET_USERS } from "../../server.js";
import uploadProfilePic from "../../helpers/uploadProfilePic.js";
import redis from "../../init/redis.js";

export default async (req, res) => {

    const data = JSON.parse(req.body.data);

    try {

        const userProfile = JSON.parse((await redis.get(`user:${req.userId}`)));

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
        else {
            channelData.image_url = channelData.type === "PUBLIC" ? "profile/channel_organization_placeholder.jpg" : "profile/channel_personal_placeholder.png";
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
            user_id: userProfile.user_id
        }, {
            $push: {
                chat_rooms: {
                    chat_id: channel._id,
                    organization_id: channel.organization_id,
                },
            }
        })

        if (SOCKET_USERS[req.userId]) {
            SOCKET_USERS[req.userId].forEach(socket => {
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