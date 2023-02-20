import prisma from "../../init/prisma.js";
import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const { channel_id, query = "", excludeMembers = [] } = req.body;
    try {
        const channel = await mongoose.channel.findOne({
            _id: channel_id,
        }).populate({
            path: "members.user",
            select: {
                user_id: 1,
            }
        });

        if (!channel) {
            return res.code(404).send({ message: "Channel not found" });
        }

        const members = await prisma.userOrganizations.findMany({
            where: {
                organization_id: channel.organization_id,
                user: {
                    email: {
                        contains: query,
                    },
                    id: {
                        notIn: [...channel.members.map(member => member.user.user_id), ...excludeMembers]
                    }
                }
            }
        });

        return res
            .code(200)
            .send({
                members: await Promise.all(members.map(async (member) => {
                    const profile = await mongoose.user.findOne(
                        {
                            user_id: member.user_id,
                        },
                        {
                            first_name: true,
                            last_name: true,
                            mini_avatar_url: true,
                            user_id: true,
                            email: true,
                        }
                    );
                    return {
                        id: profile.user_id,
                        email: profile.email,
                        profile: {
                            first_name: profile.first_name,
                            last_name: profile.last_name,
                            mini_avatar_url: profile.mini_avatar_url,
                        }
                    }
                }
                ))
            });
    }
    catch (err) {
        console.log(err);
        res.code(500).send({ message: "Server Error" });
    }
}