import * as express from "express";     // needed to handle errors
import {Application} from 'express';
import router from './appRouter';
import {MongoClient} from 'mongodb';

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const app: Application = express();
const PORT = 3000;

app.use(express.json());
app.use('/', router);

const start = async () => {
    try {
        app.listen(PORT, () => console.log('server has been started'));
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}

start();