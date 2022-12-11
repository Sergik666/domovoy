import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import dotenv from "dotenv";
dotenv.config();


export default class SubscribersManager {

    constructor(logger) {
        this.logger = logger;

        const __dirname = dirname(fileURLToPath(import.meta.url));
        const file = join(__dirname, process.env.DB_BASE_PATH);

        const adapter = new JSONFile(file);
        this.db = new Low(adapter);
    }

    async add(subscriber) {
        await this.db.read();
        this.db.data ||= { subscribers: [] }
        this.db.data.subscribers.push(subscriber);
        await this.db.write();
    }

    async exist(subscriber) {
        await this.db.read();
        this.db.data ||= { subscribers: [] }
        var index = this.db.data.subscribers.indexOf(subscriber);
        return index !== -1;
    }

    async remove(subscriber) {
        await this.db.read();
        this.db.data ||= { subscribers: [] }
        var index = this.db.data.subscribers.indexOf(subscriber);
        if (index !== -1) {
            this.db.data.subscribers.splice(index, 1);
            await this.db.write();
        }
    }

    async all() {
        await this.db.read();
        this.db.data ||= { subscribers: [] }
        return this.db.data.subscribers;
    }
}