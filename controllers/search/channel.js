import mongoose from '../../init/mongoose.js';
import es from '../../init/es.js';
import redis from '../../init/redis.js';

export default async (req, res) => {
    const { organization_id, query = "" } = req.body;

    const user = JSON.parse((await redis.get(`user:${req.userId}`)));

    try {
        const data = await es.search({
            index: "channels",
            query: {
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
        });

        const channels = data.hits.hits.map((channel) => channel._source);

        return res.code(200).send({ channels });

    } catch (error) {
        console.log(error);
        return res.code(500).send({ error: "Internal Server Error" });
    }
}