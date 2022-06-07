process.env["NTBA_FIX_319"] = 1;    // Needed to get rid of the issue
process.env["NTBA_FIX_350"] = 1;    // Needed to get rid of the issue
const axios = require("axios").default;
const TelegramBot = require("node-telegram-bot-api");
const secret = require("./.env")

const bot = new TelegramBot(token, {polling: true});

bot.onText(/(.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const messageFromUser = match[1];
    const resp = `Вы написали "${messageFromUser}"`;

    if(messageFromUser.toLowerCase() === 'photo') {
        console.log(`Пользователь ${msg.chat.first_name} ${msg.chat.last_name} запросил картинку.`);
        (async () => {
            const resp = await axios.get('https://picsum.photos/200/300');
            const pic = resp.request._redirectable._options.href
            bot.sendPhoto(chatId, pic);
        })();
    } else {
        console.log(`Пользователь ${msg.chat.first_name} ${msg.chat.last_name} написал: ${messageFromUser}`);
        bot.sendMessage(chatId, resp);
    }
});

console.log("Telegram bot successfully started...");