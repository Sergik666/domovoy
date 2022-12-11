import { Telegraf } from 'telegraf';
import dotenv from "dotenv";
import Electro from "./electro.js";
import Logger from "./logger.js";
import CronStatus from "./cron-status.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const electro = new Electro();
const logger = new Logger();
const cronStatus = new CronStatus(bot, electro, logger);

bot.start((ctx) => {
    logger.info(`Request start`, ctx.chat);
    let message = `⚡️Информация о отключении света: /electro_status`;
    ctx.reply(message);
})

bot.command('electro_status', async (ctx) => {
    try {
        logger.info(`Request electro_status`, ctx.chat);
        const status = await electro.getStatus();
        if (status) {
            ctx.reply(status);
        }
    } catch (error) {
        logger.error(error, ctx.chat);
        ctx.reply('Не удалось получить информацию об отключении');
    }
});

bot.launch();

logger.info(`Bot started`);

cronStatus.start();
