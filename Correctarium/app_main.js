const moment = require('moment');
/*
Basically this file "app_main.js" is the same file as "app.js" but with one main difference and
it's calculateDate's return:
it is "return {date: m.locale('ru').format('DD.MM.YYYY H:mm:ss'), timeStamp: m.unix()};" or
"return {date: m.locale('ru').calendar(), timeStamp: m.unix()};"
instead of "return `${m.day()}, ${m.format('H:mm')}`;".
Did it cuz it's easier to test since m.calendar() returns dynamic values so it's hard to write tests for this output.
*/
const getPriceAndHours = (lang, file_ext, charsLength) => {
    const fileExtensions = ['none', 'doc', 'docx', 'rtf'];
    const extensionRate = Object.values(fileExtensions).includes(file_ext) ? 1 : 1.20;
    let [pricePerWord, minPrice, charLimit] = (lang === 'ru' || lang === 'ua') ? [0.05, 50, 1333] :
        (lang === 'en') ? [0.12, 120, 333] : [undefined, undefined, undefined];
    if (charsLength <= charLimit)
        return {timeInHours: 1, price: (minPrice * extensionRate).toFixed(2)}
    else {
        minPrice += (charsLength - charLimit) * pricePerWord;
        const timeInHours = Math.ceil(charsLength / charLimit);
        return {timeInHours, price: (minPrice * extensionRate).toFixed(2)}
    }
}

function calculateDate(hours) {
    const m = moment();
    let hoursInSeconds = hours * 3600;
    while (hoursInSeconds > 0) {
        if (m.weekday() === 0 || m.weekday() === 6 || m.hour() >= 19)
            m.add(1, 'd').startOf('d').add(10, 'h');
        else if (m.hour() < 10)
            m.startOf('d').add(10, 'h');
        else if (m.hour() === 18) {
            if (hoursInSeconds < 3600) {
                if (m.minute() + hoursInSeconds / 60 > 60) {
                    hoursInSeconds = ((m.minute() + hoursInSeconds / 60) % 60);
                    m.add(60 - m.minute(), 'm');
                } else {
                    m.add(hoursInSeconds / 60, 'm')
                    hoursInSeconds -= hoursInSeconds;
                }
            } else {
                let minutesInSeconds = (60 - m.minute()) * 60;
                if (minutesInSeconds === 3600)
                    m.add(1, 'h');
                else
                    m.add(1, 'd').startOf('d').add(10, 'h');
                hoursInSeconds -= minutesInSeconds;
            }
        } else {
            if (hoursInSeconds < 3600) {
                m.add(hoursInSeconds / 60, 'm');
                hoursInSeconds -= hoursInSeconds;
            } else {
                m.add(1, 'h');
                hoursInSeconds -= 3600;
            }
        }
    }
    return {date: m.locale('ru').format('DD.MM.YYYY H:mm:ss'), timeStamp: m.unix()};
    // return {date: m.locale('ru').calendar(), timeStamp: m.unix()};
}

module.exports = {calculateDate, getPriceAndHours};