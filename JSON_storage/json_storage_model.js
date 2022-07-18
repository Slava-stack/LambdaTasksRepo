const {MongoClient} = require('mongodb');

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function jsonStorageValidation() {
    const collName = 'jsonDataTable';
    try {
        await client.connect();
        const database = await client.db("jsonStorage");
        const collections = await database.listCollections().toArray();
        const collectionNames = collections.map(c => c.name).includes(collName);
        if (!collectionNames)
            await database.createCollection(collName, {
                validator: {
                    $validator: {
                        bsonType: "object",
                        required: ["key", "data"],
                        properties: {
                            key: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            data: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            }
                        }
                    }
                }
            })
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}

module.exports = {jsonStorageValidation};