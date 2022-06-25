process.env["NTBA_FIX_319"] = 1;    // Needed to get rid of the issue
process.env["NTBA_FIX_350"] = 1;    // Needed to get rid of the issue

// - бот должен работать постоянно, а не только в момент, когда вы запускаете сервер.
// - продумайте вариант с использованием сокетов для того, чтобы ваш бот не усыпал по истечение 30 минут.
// https://www.youtube.com/watch?v=wG7hX8Np1Pg

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;
const _ = require('./.env');
// const WebSocket = require('ws');
// const server = new WebSocket.Server({ port:8000 });

const bot = new TelegramBot(token, {polling: true});

const cities = {Киев: {lat : 50.446990, lon : 30.522512}};

const buttons = {
    buttonsOfCities:{
        reply_markup: JSON.stringify({
            keyboard: [Object.keys(cities)]
        }),
    },
    buttonsOptions:{
        reply_markup: JSON.stringify({
            inline_keyboard: [[
                {text: 'С 6 часовым интервалом',callback_data: 6 },
                {text: 'С 3 часовым интервалом', callback_data: 3}
            ]]
        }),
    }
}

const filterResponseAPI = (resp) => {
    const daysFromResp = resp.data.list;
    let daysWithWeather = {};
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };

    daysFromResp.forEach(el => {
        const date = new Intl.DateTimeFormat('ru-RU', options).format(new Date(el.dt_txt))
        const time = el.dt_txt.split(' ')[1];
        const temp = Math.round(el.main.temp);
        const feels_like = Math.round(el.main.feels_like);
        const description = el.weather[0].description;
        const weatherValues = {time, temp, feels_like, description};

        (Object.keys(daysWithWeather).includes(date)) ?
            daysWithWeather[date].push(weatherValues) :
            daysWithWeather[date] = [weatherValues];
    });
    return daysWithWeather;
};
const getWeatherDataAccordingInterval = (daysWithWeather, interval) => {
    if (interval === 6) {
        let sixHourDaysWithWeather = {};

        for (let el in daysWithWeather) {
            daysWithWeather[el].forEach(nestedEl => {
                if (['00', '06', '12', '18'].includes(nestedEl.time.split(':')[0]))
                    (Object.keys(sixHourDaysWithWeather).includes(el)) ?
                        sixHourDaysWithWeather[el].push(nestedEl) :
                        sixHourDaysWithWeather[el] = [nestedEl];
            })
        }
        return sixHourDaysWithWeather;
    }
    else if (interval === 3) return daysWithWeather;
};
const getStringToSend = (jsonLikeData, city) => {
    let string = `Погода в городе ${city}:\n`;
    for(let el in jsonLikeData){
        string += `\n${el}:\n`;
        jsonLikeData[el].forEach(nestedEl => {
            const {time, temp, feels_like: fl, description: desc} = nestedEl;
            const alteredTime = time.split(':',2).join(':');
            const alteredTemp = (temp >= 0) ? `+${temp}`: `${temp}`;
            const alteredFl = (fl >= 0) ? `+${fl}` : `${fl}`;
            string += ` ${alteredTime}, ${alteredTemp}°C, ${alteredFl}°C, ${desc}\n`});
    }
    return string;
};
async function getWeatherData(city, interval, chatId) {
    const resp = await axios.get(    `https://api.openweathermap.org/data/2.5/forecast?lat=` +
    `${cities[city].lat}&lon=${cities[city].lon}&units=metric&lang=ru&appid=${apiKey}`);
    const dataReform = filterResponseAPI(resp);
    const daysWithWeather = getWeatherDataAccordingInterval(dataReform, interval);
    const jsonLikeData = getStringToSend(daysWithWeather, city);
    await bot.sendMessage(chatId, jsonLikeData);
}

bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Нажмите на город.', buttons.buttonsOfCities);
    bot.onText(/Киев/, msg => {
        const city =  msg.text;
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, `Погода для города ${city}:`, buttons.buttonsOptions);
        bot.on('callback_query', msg => getWeatherData(city, +msg.data, msg.message.chat.id));
    });
});
