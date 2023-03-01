import mongoose from "../../init/mongoose.js";
import prisma from "../../init/prisma.js";

export default async (req, res) => {
    const { organization_id, query = "", excludeMembers = [] } = req.body;
    try {
        const members = await prisma.userOrganizations.findMany({
            where: {
                organization_id,
                user: {
                    email: {
                        contains: query,
                    }
                },
                user_id: {
                    notIn: excludeMembers
                }
            },
            include: {
                user: {
                }
            }
        });

        return res
            .code(200)
            .send({
                members: await Promise.all(members.map(async (member) => {
                    const profile = await mongoose.user.findOne(
                        {
                            user_id: member.user.id,
                        },
                        {
                            first_name: true,
                            last_name: true,
                            image_url: true,
                            user_id: true,
                        }
                    );
                    return {
                        id: member.user.id,
                        email: member.user.email,
                        user: {
                            first_name: profile.first_name,
                            last_name: profile.last_name,
                            image_url: profile.image_url,
                        }
                    }
                }))
            }
        );
    }
    catch (err) {
        console.log(err);
        res.code(500).send({ message: "Server Error" });
    }
}