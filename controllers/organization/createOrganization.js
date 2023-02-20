import prisma from "../../init/prisma.js";
import mongoose from "../../init/mongoose.js";

export default async (req, res) => {
    const { name, is_discoverable } = req.body;
    try {
        const organization = await prisma.organization.create({
            data: {
                name,
                is_discoverable,
                owner: {
                    connect: { id: req.userId },
                },
            },
        });

        await prisma.userOrganizations.create({
            data: {
                user: {
                    connect: { id: req.userId },
                },
                organization: {
                    connect: { id: organization.id },
                },
            },
        })

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

        if (!defaultOrg) {
            await prisma.user.update({
                where: {
                    id: req.userId,
                },
                data: {
                    default_organization_id: organization.id,
                }
            })
        }

        return res
            .code(200)
            .send({ message: "Organization created", organizations: orgs });
    }
    catch (error) {
        if (error.code === "P2014") {
            return res.code(400).send({ message: "Already created one Organization" });
        }
        console.log(error);
        res.code(500).send({ message: "Server Error" });
    }
}