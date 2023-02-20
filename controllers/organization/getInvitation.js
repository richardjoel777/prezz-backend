import prisma from "../../init/prisma.js";

export default async (req, res) => {
    const { invitation_id } = req.params;
    try {
        const invite = await prisma.organizationInvite.findUnique({
            where: {
                id: invitation_id,
            },
            include: {
                organization: {
                    include: {
                        owner: true,
                    }
                }
            }
        });
        if (!invite) {
            return res.code(404).send({ message: "Invite not found" });
        }

        return res.code(200).send({
            invite: {
                id: invite.id,
                email: invite.email,
                first_name: invite.first_name,
                created_at: invite.created_at,
                organization: invite.organization_id,
                owner_email: invite.organization.owner.email
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.code(500).send({ message: "Internal server error" });
    }
}