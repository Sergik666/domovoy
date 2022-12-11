import { Telegraf } from 'telegraf';
import dotenv from "dotenv";
import Electro from "./electro.js";
import Logger from "./logger.js";
import CronStatus from "./cron-status.js";
import SubscribersManager from "./subscribers-manager.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const electro = new Electro();
const logger = new Logger();
const subscribersManager = new SubscribersManager(logger)
const cronStatus = new CronStatus(bot, electro, subscribersManager, logger);

bot.start((ctx) => {
    logger.info(`Request start`, ctx.chat);
    const messages = [
        `⚡️Информация об отключении света: /electro_status`,
        `⏰ Подписка на уведомления об измении /subscribe`,
        `❌ Отписка от уведомлений /unsubscribe`,
        `♻️ Статус подписки уведомлений /subscribe_status`];
    ctx.reply(messages.join('\n'));
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

bot.command('subscribe', async (ctx) => {
    try {
        logger.info(`Request subscribe`, ctx.chat);
        await subscribersManager.add(ctx.chat.id);
        ctx.reply('👍 Подписка оформлена');
    } catch (error) {
        logger.error(error, ctx.chat);
    }
});

bot.command('unsubscribe', async (ctx) => {
    try {
        logger.info(`Request unsubscribe`, ctx.chat);
        await subscribersManager.remove(ctx.chat.id);
        ctx.reply('😪 Подписка отменена');
    } catch (error) {
        logger.error(error, ctx.chat);
    }
});

bot.command('subscribe_status', async (ctx) => {
    try {
        logger.info(`Request subscribe_status`, ctx.chat);
        if (await subscribersManager.exist(ctx.chat.id)) {
            ctx.reply('👍 Подписка оформлена');
        } else {
            ctx.reply('😪 Подписка не оформлена');
        }
    } catch (error) {
        logger.error(error, ctx.chat);
    }
});

bot.launch();

logger.info(`Bot started`);

cronStatus.start();
