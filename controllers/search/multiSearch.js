import es from '../../init/es.js';
import mongoose from '../../init/mongoose.js';
import prisma from "../../init/prisma.js";
import redis from '../../init/redis.js';

export default async (req, res) => {
    try {
        const { query = "", organization_id, offset = 0 } = req.body;
        const organizationUsers = await prisma.userOrganizations.findMany({
            where: {
                organization_id
            },
        })

        const userIds = organizationUsers.map((user) => user.user_id);

        const user = JSON.parse((await redis.get(`user:${req.userId}`)));

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

        // console.log(channels, userIds);

        const userQuery = {
            bool: {
                must: [
                    {
                        query_string: {
                            query: `*${query}*`,
                            fields: ["first_name", "last_name", "email"]
                        }
                    },
                    {
                        terms: {
                            user_id: userIds
                        }
                    }
                ],
                must_not: [
                    {
                        term: {
                            user_id: req.userId
                        }
                    }
                ]
            }
        };

        const channelQuery = {
            bool: {
                should: [
                    {
                        bool: {
                            must: [
                                {
                                    query_string: {
                                        query: `*${query}*`,
                                        fields: ["name"]
                                    }
                                },
                                {
                                    term: {
                                        organization_id
                                    }
                                },
                                {
                                    term: {
                                        type: "PUBLIC"
                                    }
                                },
                                {
                                    term: {
                                        visibility: true
                                    }
                                }
                            ]
                        }
                    },
                    {
                        bool: {
                            must: [
                                {
                                    query_string: {
                                        query: `*${query}*`,
                                        fields: ["name"]
                                    }
                                },
                                {
                                    term: {
                                        organization_id
                                    }
                                },
                                {
                                    term: {
                                        type: "PRIVATE"
                                    }
                                },
                                {
                                    nested: {
                                        path: "members",
                                        query: {
                                            bool: {
                                                must: [
                                                    {
                                                        term: {
                                                            "members.user": user._id
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        bool: {
                            must: [
                                {
                                    query_string: {
                                        query: `*${query}*`,
                                        fields: ["name"]
                                    }
                                },
                                {
                                    term: {
                                        organization_id
                                    }
                                },
                                {
                                    term: {
                                        type: "PUBLIC"
                                    }
                                },
                                {
                                    nested: {
                                        path: "members",
                                        query: {
                                            bool: {
                                                must: [
                                                    {
                                                        term: {
                                                            "members.user": user._id
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }

        const messageQuery = {
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
                                { term: { sender: user._id } },
                                { term: { receiver: user._id } },
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
        };

        const data = await es.msearch({
            searches: [
                {
                    index: 'users',
                    // query: userQuery
                },
                {
                    query: userQuery
                },
                {
                    index: 'channels',
                    // query: channelQuery
                },
                {
                    query: channelQuery
                },
                {
                    index: 'messages',
                },
                {
                    query: messageQuery,
                    from: offset,
                    size: 10
                }
            ]
        })

        const users = data.responses[0].hits.hits.map((user) => user._source);
        const channelsData = data.responses[1].hits.hits.map((channel) => channel._source);
        const messages = await Promise.all(data.responses[2].hits.hits.map((msg) => msg._source).map(async (message) => {
            const promises = [];
            if (message.sender) {
                promises.push(mongoose.user.findOne({ _id: message.sender }, {
                    first_name: true,
                    last_name: true,
                    image_url: true,
                    user_id: true,
                }).lean());
            }
            if (message.receiver) {
                promises.push(mongoose.user.findOne({ _id: message.receiver }, {
                    first_name: true,
                    last_name: true,
                    image_url: true,
                    user_id: true,
                }).lean());
            }
            if (message.channel) {
                promises.push(mongoose.channel.findOne({ _id: message.channel }, {
                    name: true,
                    image_url: true,
                    type: true,
                }).lean());
            }
            const results = await Promise.all(promises);
            if (message.sender) {
                message.sender = results.shift();
            }
            if (message.receiver) {
                message.receiver = results.shift();
            }
            if (message.channel) {
                message.channel = results.shift();
            }
            return message;
        }));


        return res.send({
            users,
            channels: channelsData,
            messages
        });

    } catch (error) {
        console.log(error);
        return res.code(500).send({ error: "Internal Server Error" });
    }
}