import {MongoClient} from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

export default async function jsonStorageValidation() {
    const collName: string = 'jsonDataTable';
    try {
        await client.connect();
        const database = await client.db("jsonStorage");
        const collections = await database.listCollections().toArray();
        const collectionNames = collections.map(c => c.name).includes(collName);
        if (!collectionNames)
            await database.createCollection(collName, {
                autoIndexId: false,
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["json"],
                        properties: {
                            json: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            }
                        }
                    }
                }
            });
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}