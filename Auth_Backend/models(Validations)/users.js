const {MongoClient} = require('mongodb');

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function runUserValidation() {
    const collName = 'Users';
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
                        required: ["email", "password"],
                        properties: {
                            email: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            password: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
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

// runUserValidation().catch(console.dir);

module.exports = {runUserValidation};

// Just because the Node.js driver doesn't have the concept of a model, does not mean we couldn't create models(Validations) to represent our MongoDB data at the application level. We could just as easily create a generic model or use a library such as objectmodel. We could create a Blog model like so:
// https://www.mongodb.com/developer/languages/javascript/mongoose-versus-nodejs-driver/

// MongoServerError: Collection already exists. NS: jwtoken.Users
// https://stackoverflow.com/questions/21023982/how-to-check-if-a-collection-exists-in-mongodb-native-nodejs-driver
// https://www.faqcode4u.com/faq/54364/how-to-check-if-a-collection-exists-in-mongodb-native-nodejs-driver