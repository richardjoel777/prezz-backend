import prisma from "../../init/prisma.js";

export default async (req, res) => {
    const { invitation_id } = req.body;

    try {

        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
            select: {
                id: true,
                email: true,
            },
        });

        const invitation = await prisma.organizationInvite.findFirst({
            where: {
                id: invitation_id,
                email: user.email,
            },
            select: {
                organization_id: true,
            },
        });

        if (!invitation) {
            return res.code(404).send({ message: "Invite not found" });
        }

        const organization_id = invitation.organization_id;

        const organization = await prisma.organization.findUnique({
            where: {
                id: organization_id,
            },
            select: {
                owner_id: true,
            },
        });

        if (!organization) {
            return res.code(404).send({ message: "Organization not found" });
        }

        try {

            const joinOrg = prisma.userOrganizations.create({
                data: {
                    user_id: req.userId,
                    organization_id: organization_id
                },
            });
            const deleteInvite = prisma.organizationInvite.delete({
                where: {
                    id: invitation_id
                }
            });

            await Promise.all([joinOrg, deleteInvite]);

            return res.code(200).send({ message: "User added to organization" });
        }
        catch (error) {
            if (error.code === "P2002") {
                return res.code(400).send({ message: "User already in organization" });
            }
            else {
                console.log(error);
                return res.code(500).send({ message: "Internal server error" });
            }
        }

    }
    catch (error) {
        console.log(error);
        res.code(500).send({ message: "Internal server error" });
    }
}