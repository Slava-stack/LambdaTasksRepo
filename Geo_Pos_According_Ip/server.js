import express from 'express';
import { decIpToIp, ipToDecIp, findIpRowAccordingDecIp} from './middlewares.js';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('server has been started')
});

app.get('/', (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const decIp = ipToDecIp(ip);
    fs.readFile('./IP2LOCATION-LITE-DB1.CSV', (err, lines) => {
        if (err) throw err;
        let getUsersGeoInfo = findIpRowAccordingDecIp(lines, decIp);
        getUsersGeoInfo.ip = ip;
        res.send(JSON.stringify(getUsersGeoInfo));
    })
});
