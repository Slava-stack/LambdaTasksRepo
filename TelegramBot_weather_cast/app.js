process.env["NTBA_FIX_319"] = 1;    // Needed to get rid of the issue
process.env["NTBA_FIX_350"] = 1;    // Needed to get rid of the issue

// IT SHOULD BE DONE VIA WEB SOCKETS BUT I DON'T KNOW AND VLADIMIR SAID THAT THERE IS AN ISSUE WITH THAT.
// - продумайте вариант с использованием сокетов для того, чтобы ваш бот не усыпал по истечение 30 минут. (бот на хероку)

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;
const _ = require('./.env');
const fs = require('fs');

const bot = new TelegramBot(token, {polling: true});

const citiesGeo = {Киев: {lat: 50.446990, lon: 30.522512}};
const banks = [{name: 'monobank', url: 'https://api.monobank.ua/bank/currency'},
    {name: 'privatbank', url: 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'}]
// tg buttons
const buttons = {
    buttonsOfCities: {
        reply_markup: JSON.stringify({
            keyboard: [Object.keys(citiesGeo)],
            one_time_keyboard: true
        }),
    },
    choiseButtons: {
        reply_markup: JSON.stringify({
            keyboard: [['Погода'], ['Курс валют']],
            one_time_keyboard: true
        }),
    },
    currencyButtonsV2: {
        reply_markup: JSON.stringify({
            keyboard: [['$'], ['€']],
            one_time_keyboard: true
        }),
    },
    buttonsOptionsV2: {
        reply_markup: JSON.stringify({
            keyboard: [['С 6 часовым интервалом'], ['С 3 часовым интервалом']],
            one_time_keyboard: true
        }),
    },
}

// Currency
const getAPICurrencyRates = async (APIurl, bankName) => {
    const resp = await axios.get(APIurl)
    const API = resp.data;
    fs.writeFile(`${bankName}.json`, JSON.stringify(API), err => {
        if (err) console.log(err);
    })
    return API;
}
const getDollars = (PrivatBankJSON, MonoBankJSON) => {
    const PrivatDollar = PrivatBankJSON.filter(el => el.ccy === 'USD');
    const MonoDollar = MonoBankJSON.filter(el => el.currencyCodeA === 840 && el.currencyCodeB === 980)
    return {privat: PrivatDollar[0], mono: MonoDollar[0]};
}
const getEuros = (PrivatBankJSON, MonoBankJSON) => {
    const PrivatEuro = PrivatBankJSON.filter(el => el.ccy === 'EUR');
    const MonoEuro = MonoBankJSON.filter(el => el.currencyCodeA === 978 && el.currencyCodeB === 980)
    return {privat: PrivatEuro[0], mono: MonoEuro[0]};
}
const getCurrencyMsg = (currency) => {
    const {buy: privatBuy, sale: privatSale} = currency.privat
    const {rateBuy: monoBuy, rateSell: monoSale} = currency.mono
    const privatRates = `Приватбанк: 
    покупка - ${(+privatBuy).toFixed(2)} 
    продажа - ${(+privatSale).toFixed(2)}`;
    const monoRates = `Монобанк: 
    покупка - ${monoBuy.toFixed(2)} 
    продажа - ${monoSale.toFixed(2)}`;
    return `${privatRates}\n${monoRates}`
}
const sendEuro = async (chatId) => {
    const privatBankAPI = await getAPICurrencyRates(banks[1].url, banks[1].name);
    try {
        const monoBankAPI = await getAPICurrencyRates(banks[0].url, banks[0].name);
        const euroRates = getEuros(privatBankAPI, monoBankAPI);
        bot.sendMessage(chatId, `€ ${getCurrencyMsg(euroRates)}`);
    } catch {
        fs.readFile(`${banks[0].name}.json`, 'utf-8', (err, monoData) => {
            const euroRates = getEuros(privatBankAPI, JSON.parse(monoData));
            bot.sendMessage(chatId, `€ ${getCurrencyMsg(euroRates)}`);
        })
    }
}
const sendDollars = async (chatId) => {
    const privatBankAPI = await getAPICurrencyRates(banks[1].url, banks[1].name);
    try {
        const monoBankAPI = await getAPICurrencyRates(banks[0].url, banks[0].name);
        const dollarRates = getDollars(privatBankAPI, monoBankAPI);
        bot.sendMessage(chatId, `$ ${getCurrencyMsg(dollarRates)}`);
    } catch {
        fs.readFile(`${banks[0].name}.json`, 'utf-8', (err, monoData) => {
            const dollarRates = getDollars(privatBankAPI, JSON.parse(monoData));
            bot.sendMessage(chatId, `$ ${getCurrencyMsg(dollarRates)}`);
        })
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

// Weather
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
    } else if (interval === 3) return daysWithWeather;
};
const getStringToSend = (jsonLikeData, city) => {
    let string = `Погода в городе ${city}:\n`;
    for (let el in jsonLikeData) {
        string += `\n${el}:\n`;
        jsonLikeData[el].forEach(nestedEl => {
            const {time, temp, feels_like: fl, description: desc} = nestedEl;
            const alteredTime = time.split(':', 2).join(':');
            const alteredTemp = (temp >= 0) ? `+${temp}` : `${temp}`;
            const alteredFl = (fl >= 0) ? `+${fl}` : `${fl}`;
            string += ` ${alteredTime}, ${alteredTemp}°C, ${alteredFl}°C, ${desc}\n`
        });
    }
    return string;
};

async function getWeatherData(city, interval, chatId) {
    const resp = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=` +
        `${citiesGeo[city].lat}&lon=${citiesGeo[city].lon}&units=metric&lang=ru&appid=${apiKey}`);
    const dataReform = filterResponseAPI(resp);
    const daysWithWeather = getWeatherDataAccordingInterval(dataReform, interval);
    const jsonLikeData = getStringToSend(daysWithWeather, city);
    await bot.sendMessage(chatId, jsonLikeData);
}

// tg bot
bot.onText(/.+/, (match, msg) => {
    const answer = match.text.trim();
    const chatId = match.chat.id;
    switch (answer) {
        case '/start':
            bot.sendMessage(chatId, 'Выберите опцию', buttons.choiseButtons);
            break;
        case 'Погода':
            bot.sendMessage(chatId, 'Погода для города Киев:', buttons.buttonsOptionsV2);
            break;
        case 'С 6 часовым интервалом':
            getWeatherData('Киев', 3, chatId);
            break;
        case 'С 3 часовым интервалом':
            getWeatherData('Киев', 6, chatId);
            break;
        case 'Курс валют':
            bot.sendMessage(chatId, "Выберите интересующую валюту", buttons.currencyButtonsV2);
            break;
        case '$':
            sendDollars(chatId);
            break;
        case '€':
            sendEuro(chatId);
            break;
        default:
            bot.sendMessage(chatId, "Пожалуйста введите /start и выберите нужную кнопку.");
    }
})