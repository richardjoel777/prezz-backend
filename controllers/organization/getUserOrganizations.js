import mongoose from "../../init/mongoose.js";
import prisma from "../../init/prisma.js";

export default async (req, res) => {
    try {
        const organizations = (await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
            include: {
                organizations: {
                    include: {
                        organization: {
                        },
                    }
                }
            }
        })).organizations;

        const defaultOrg = (await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
            select: {
                default_organization_id: true,
            }
        })).default_organization_id;

        const orgs = await Promise.all(organizations.map(async (org) => {
            const owner = await mongoose.user.findOne({
                user_id: org.organization.owner_id,
            }, {
                user_id: 1,
                first_name: 1,
                last_name: 1,
                email: 1,
            });
            // console.log(owner);
            return {
                id: org.organization.id,
                name: org.organization.name,
                isDefault: org.organization.id === defaultOrg,
                owner: {
                    name: `${owner.first_name} ${owner.last_name}`,
                    email: owner.email,
                    id: owner.user_id,
                }
            }
        }));

        // console.log(orgs, req.userId);

        return res.code(200).send({ organizations: orgs });
    }
    catch (error) {
        console.log(error);
        res.code(500).send({ message: "Internal server error" });
    }
}