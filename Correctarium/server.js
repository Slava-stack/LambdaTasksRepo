const express = require('express');
const moment = require('moment')
const {calculateDate, getPriceAndHours} = require('./app_main.js')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post('/', (req, res) => {
    const {language, mimetype, count} = req.body;
    const {timeInHours, price} = getPriceAndHours(language, mimetype, count);
    const {date, timeStamp} = calculateDate(timeInHours);
    const responseJSON = JSON.stringify({
        price: +price,
        time: timeInHours,
        deadline: timeStamp,
        deadline_date: date
    });
    console.log(responseJSON);
    res.send(responseJSON);
});


app.listen(PORT, () => {
    console.log('server has been started');
});