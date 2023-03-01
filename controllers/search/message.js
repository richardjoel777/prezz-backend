import mongoose from "../../init/mongoose.js";
import es from "../../init/es.js";
import redis from "../../init/redis.js";

export default async (req, res) => {
    try {

        const { query = "", organization_id, offset = 0 } = req.body;

        const user = JSON.parse((await redis.get(`user:${req.userId}`)));

        console.log(query);

        const channels = (await es.search({
            index: 'channels',
            query: {
                nested: {
                    path: 'members',
                    query: {
                        term: {
                            'members.user': user._id
                        }
                    }
                }
            }
        })).hits.hits.map((channel) => channel._source.id);

        console.log(channels);

        const data = await es.search({
            index: "messages",
            from: offset,
            size: 15,
            query: {
                bool: {
                    must: [
                        {
                            bool: {
                                should: [
                                    {
                                        query_string: {
                                            query: `*${query}*`,
                                            fields: ['content']
                                        },
                                    },
                                    {
                                        nested: {
                                            path: 'files',
                                            query: {
                                                query_string: {
                                                    query: `*${query}*`,
                                                    fields: ['files.name']
                                                },
                                            }
                                        }
                                    }
                                ]
                            },
                        },
                        {
                            term: {
                                organization_id
                            }
                        },
                        {
                            term: {
                                is_deleted: false
                            }
                        }
                    ],
                    filter: [
                        {
                            bool: {
                                should: [
                                    { bool: { must: [{ bool: { must_not: [{ term: { sender: user._id } }] } }, { term: { is_private: true } }] } },
                                    { bool: { must: [{ term: { receiver: user._id } }, { term: { is_private: true } }] } },
                                    {
                                        terms: {
                                            channel: channels
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
        });

        console.log(data.hits.hits.length);


        const messages = data.hits.hits.map((message) => message._source);

        const messagesData = await Promise.all(messages.map(async (message) => {
            if (message.sender) {
                const sender = await mongoose.user.findOne({ _id: message.sender }, {
                    first_name: true,
                    last_name: true,
                    image_url: true,
                    user_id: true,
                });
                message.sender = sender;
            }
            if (message.receiver) {
                const receiver = await mongoose.user.findOne({ _id: message.receiver }, {
                    first_name: true,
                    last_name: true,
                    image_url: true,
                    user_id: true,
                });
                message.receiver = receiver;
            }
            if (message.channel) {
                const channel = await mongoose.channel.findOne({ _id: message.channel }, {
                    name: true,
                    image_url: true,
                    type: true,
                })
                message.channel = channel;
            }
            return message;
        }));


        return res.code(200).send({ messages: messagesData });

    } catch (error) {
        console.log(error);
        return res.code(500).send({ error: "Internal Server Error" });
    }
}