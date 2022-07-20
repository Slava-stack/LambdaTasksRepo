import jsonStorageValidation from './jsonStorageModel';
import {MongoClient} from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

class JsonService {
    public async write(key: string, json: string) {
        try {
            await jsonStorageValidation();
            await client.connect();
            const jsonStorageColl = await client.db('jsonStorage').collection('jsonDataTable');
            const twinKey = await jsonStorageColl.findOne({_id: key});
            if (twinKey)
                return {status: 409, message: 'Link with such parameter already exists'};
            await jsonStorageColl.insertOne({_id: key, json: JSON.stringify(json)});
        } catch (e) {
            console.log(e);
            return {status: 500, message: 'Something bad happened'};
        }
    }

    public async read(key: string) {
        try {
            const jsonStorageColl = await client.db('jsonStorage').collection('jsonDataTable');
            const dataExtraction = await jsonStorageColl.findOne({_id: key});
            if (!dataExtraction)
                return {status: 404, message: 'No data with such url parameter'};
            return dataExtraction;
        } catch (e) {
            console.log(e);
            return {status: 500, message: 'Something bad happened'};
        }
    }
}

export default new JsonService();