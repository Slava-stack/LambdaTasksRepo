const {MongoClient} = require('mongodb');

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function runJWTValidation() {
    const collName = 'refresh';
    try {
        await client.connect();
        const database = await client.db("jwtoken");
        const collections = await database.listCollections().toArray();
        const collectionNames = collections.map(c => c.name).includes(collName);
        if (!collectionNames)
            await database.createCollection(collName, {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["userId", "refreshToken"],
                        properties: {
                            userId:{
                                bsonType: "objectId",
                                description: "must be a objectId and is required"
                            },
                            refreshToken: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            }
                        }
                    }
                }
            })
    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }
}

// runJWTValidation().catch(console.dir);

module.exports = {runJWTValidation};
