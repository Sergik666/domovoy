const { Telegraf } = require('telegraf');
require('dotenv').config();
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    let message = `⚡️Информация о отключении света: /electro_status`;
    ctx.reply(message);
})

bot.command('electro_status', async (ctx) => {
    try {
        const status = await axios.get(process.env.ELECTRO_STATUS_API_URL)
        ctx.reply(status.data);
        
    } catch (error) {
        console.log('error', error);
        ctx.reply('Не удалось получить информацию об отключении');
    }
})

bot.launch();
