process.env["NTBA_FIX_319"] = 1;
process.env["NTBA_FIX_350"] = 1;
const tgData = require("./.env")    // contains token and userId
const TelegramBot = require('node-telegram-bot-api');
const program = require('commander');

const bot = new TelegramBot(token, {polling: true});

program.version("1.0.1");

program.command('message')
    .description('Send a message to the Telegram Bot')
    .alias('m')
    .argument('message')
    .action(async arg => {
        await bot.sendMessage(userId, arg);
        process.exit();
    });

program.command('photo')
    .description('Send a photo to the Telegram Bot. Just drag and drop it into the console after -p flag')
    .alias('p')
    .argument('path')
    .action(async arg => {
        await bot.sendPhoto(userId, arg);
        process.exit();
    });

program.command('help')
    .description('Display help for the command')
    .argument('[command]')
    .action(arg => {
        if (arg === 'message' || arg === 'm')
            console.log('After the flag "m" or "message" write down text to send it to the Telegram Bot. ' +
                'The command looks like: node CLI_tg_sender.js m|message "hello!" sends text hello!.');
        else if (arg === 'photo' || arg === 'p')
            console.log('After the flag "p" or "photo" write down path to a photo or drag and drop it to ' +
                'the console to send it to the Telegram Bot. The command looks like: node CLI_tg_sender.js' +
                ' p|photo "hello!" sends text hello!.');
        else console.log("There is no such command. Use --help to watch commands.");
        process.exit();
    });

program.parse(process.argv);