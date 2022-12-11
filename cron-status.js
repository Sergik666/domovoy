import cron from 'node-cron';

export default class CronStatus {

    constructor(bot, electro, subscribersManager, logger) {
        this.bot = bot;
        this.electro = electro;
        this.subscribersManager = subscribersManager;
        this.logger = logger;
        this.status = '';
    }

    async start() {
        await this.updateStatus();
        cron.schedule('*/30 * * * *', async () => {
            try {
                await this.updateStatus();
            } catch (error) {
                this.logger.error(error);
            }
        });
    }

    async updateStatus() {
        this.logger.info(`CronStatus. updateStatus..`);
        const status = await this.electro.getStatus();
        if (!this.status) {
            this.status = status;
            return;
        }
        if (this.status !== status) {
            this.status = status;
            await this.sendNewStatus();
        }
    }

    async sendNewStatus() {
        if (!this.status) {
            return;
        }
        const message = `⚡️ Новые данные:\n${this.status}`;
        this.logger.info(message);
        const subscribersIds = await this.getSubscribersIds();
        subscribersIds.forEach(subscriberId => {
            this.bot.telegram.sendMessage(subscriberId, message);
        });
    }

    async getSubscribersIds() {
        return await this.subscribersManager.all();
    }
}