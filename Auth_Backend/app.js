const express = require('express');
const {MongoClient} = require('mongodb');
const authRouter = require('./authRouter');
// const cookieParser = require('cookie-parser');      // probably I don't need this line;

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const app = express();

app.use(express.json());
// app.use(cookieParser());    // probably I don't need this line either;
app.use("/", authRouter);

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await client.connect();
        app.listen(PORT, () => console.log('server has been started'));
    } catch (e) {
        console.log(e);
    }
    finally {
        await client.close();
    }
}

start();