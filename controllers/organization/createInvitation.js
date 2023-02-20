import prisma from '../../init/prisma.js'
import mailQueue from '../../helpers/mailQueue.js'

export default async (req, res) => {

    const { invitations, organization_id } = req.body

    try {

        const organization = await prisma.organization.findUnique({
            where: {
                id: organization_id
            },
        })

        if (!organization) {
            return res.code(404).send({ message: 'Organization not found' })
        }

        if (organization.owner_id !== req.userId) {
            return res.code(403).send({ message: 'Forbidden' })
        }

        const inviteMany = invitations.map(invitation => prisma.organizationInvite.create({
            data: {
                email: invitation.email,
                first_name: invitation.first_name ?? invitation.email.split('@')[0],
                organization_id: organization_id,
            }
        }))

        const invites = await Promise.all(inviteMany)

        invites.map(invite => mailQueue.add({
            email: invite.email,
            subject: `Invitation to join ${organization.name}`,
            text: `Dear ${invite.first_name}, \n\n` +
                `You have been invited to join ${organization.name} on Prezz. \n\n` +
                `Please click on the link below to join the organization. \n\n` +
                `${process.env.CLIENT_ENDPOINT}/join-organization?id=${invite.id} \n\n` +
                `This is a auto-generated email. Please do not reply to this email.\n\n` +
                `Regards\n` +
                `Team Prezz\n\n`
        }))

        // console.log("[INVITATION]", invites.map(invite => invite.id))
    }
    catch (error) {
        console.log(error)
        return res.code(500).send({ message: 'Internal server error' })
    }

    return res.code(200).send({ message: 'Invitation created' })
}