import es from '../init/es.js'

const mapUsers = {
    index: 'users',
    type: 'user',
    body: {
        "mappings": {
            "properties": {
                "_id": {
                    "type": "keyword"
                },
                "user_id": {
                    "type": "keyword"
                },
                "first_name": {
                    "type": "text"
                },
                "last_name": {
                    "type": "text"
                },
                "image_url": {
                    "type": "text"
                },
                "email": {
                    "type": "keyword"
                },
            }
        }
    }
}

const mapChannels = {
    index: "channels",
    type: "channel",
    body: {
        "properties": {
            "_id": {
                "type": "keyword"
            },
            "organization_id": {
                "type": "keyword"
            },
            "name": {
                "type": "text"
            },
            "image_url": {
                "type": "text"
            },
            "description": {
                "type": "text"
            },
            "type": {
                "type": "keyword"
            },
            "visibility": {
                "type": "boolean"
            },
            "members": {
                "type": "nested",
                "properties": {
                    "user": {
                        "type": "join",
                        "relations": {
                            "user": "user"
                        }
                    }
                },
                "role": {
                    "type": "keyword"
                },
            }
        },
    }
}

const mapMessages = {
    index: "messages",
    type: "message",
    body: {
        "properties": {
            "_id": {
                "type": "keyword"
            },
            "organization_id": {
                "type": "keyword"
            },
            "chat_id": {
                "type": "keyword"
            },
            "sender": {
                "type": "join",
                "relations": {
                    "user": "message"
                }
            },
            "receiver": {
                "type": "keyword"
            },
            "channel": {
                "type": "keyword"
            },
            "content": {
                "type": "text"
            },
            "files": {
                "type": "nested",
                "properties": {
                    "key": {
                        "type": "keyword"
                    },
                    "name": {
                        "type": "text"
                    },
                    "fileSize": {
                        "type": "integer"
                    },
                    "mimetype": {
                        "type": "text"
                    },
                }
            },
            "created_at": {
                "type": "date"
            },
            "is_deleted": {
                "type": "boolean"
            },
        }
    }
}

// Create the index
// es.indices.create({
//     index: 'users'
// }, (err, resp, status) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("create", resp);
//     }
// }
// );

// es.indices.create({
//     index: 'channels'
// }, (err, resp, status) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("create", resp);
//     }
// }
// );

// es.indices.create({
//     index: 'messages'
// }, (err, resp, status) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("create", resp);
//     }
// }
// );

// Put the mapping

es.indices.putMapping(mapUsers, (err, resp, status) => {
    if (err) {
        console.log(err);
    } else {
        console.log("users mapping", resp);
    }
}
);

es.indices.putMapping(mapChannels, (err, resp, status) => {
    if (err) {
        console.log(err);
    } else {
        console.log("channels mapping", resp);
    }
}
);

// es.indices.putMapping(mapMessages, (err, resp, status) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("messages mapping", resp);
//     }
// }
// );