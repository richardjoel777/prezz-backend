import mongoose from '../../init/mongoose.js'
import es from '../../init/es.js'

export default async (req, res) => {
    try {
        const users = await mongoose.user.find({})

        const channels = await mongoose.channel.find({})

        const messages = await mongoose.message.find({})

        await Promise.all(users.map(async (user) => {
            const { _id, user_id, first_name, last_name, image_url, email } = user
            const body = {
                id: _id,
                user_id,
                first_name,
                last_name,
                image_url,
                email
            }
            await es.create({
                index: 'users',
                id: _id,
                document: body
            })
        }))

        await Promise.all(channels.map(async (channel) => {
            const { _id, organization_id, name, image_url, description, type, visibility, members } = channel
            const body = {
                id: _id,
                organization_id,
                name,
                image_url,
                description,
                type,
                visibility,
                members
            }
            await es.create({
                index: 'channels',
                id: _id,
                body
            })
        }
        ))

        await Promise.all(messages.map(async (message) => {
            const { _id, organization_id, chat_id, sender, receiver, channel, content, files, created_at, is_deleted, is_private } = message
            const body = {
                id: _id,
                organization_id,
                chat_id,
                sender,
                content,
                files,
                created_at,
                is_deleted,
                is_private
            }

            if (receiver) {
                body.receiver = receiver
            }

            if (channel) {
                body.channel = channel
            }

            await es.create({
                index: 'messages',
                id: _id,
                document: body
            })
        }
        ))

        res.code(200).send({ message: 'Populated' })

    }
    catch (err) {
        console.log(err)
        res.code(500).send({ message: 'Internal server error' })
    }
}
