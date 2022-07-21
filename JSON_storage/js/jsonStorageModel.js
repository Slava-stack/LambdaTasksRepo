"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const uri = 'mongodb://127.0.0.1:27017';
const client = new mongodb_1.MongoClient(uri);
function jsonStorageValidation() {
    return __awaiter(this, void 0, void 0, function* () {
        const collName = 'jsonDataTable';
        try {
            yield client.connect();
            const database = yield client.db("jsonStorage");
            const collections = yield database.listCollections().toArray();
            const collectionNames = collections.map(c => c.name).includes(collName);
            if (!collectionNames)
                yield database.createCollection(collName, {
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
        }
        catch (e) {
            console.log(e);
        }
        finally {
            yield client.close();
        }
    });
}
exports.default = jsonStorageValidation;
