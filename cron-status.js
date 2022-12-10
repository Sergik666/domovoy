const cron = require('node-cron');

module.exports = class CronStatus {

    constructor(bot, electro, logger) {
        this.bot = bot;
        this.electro = electro;
        this.logger = logger;
        this.status = '';
    }

    async start() {
        await this.updateStatus();
        cron.schedule('* */30 * * * *', async () => {
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
        if(!this.status) {
            this.status = status;
            return;
        }
        if(this.status != status) {
            this.status = status;
            this.sendNewStatus();
        }
    }

    sendNewStatus() {
        if(!this.status) {
            return;
        }
        const message = `⚡️ Новые данные:\n${this.status}`;
        this.logger.info(message);
        const subscribersIds = this.getSubscribersIds();
        subscribersIds.forEach(subscriberId => {
            this.bot.telegram.sendMessage(subscriberId, message );
        });
    }

    getSubscribersIds () {
        return process.env.SUBSCRIBERS?.split(',');
    }
}