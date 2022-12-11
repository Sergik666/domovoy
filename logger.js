export default class Logger {
    info(message, chat) {
        if (chat) {
            this._logInfoMessage(`${message}, ${this.getUserLog(chat)}`);
        } else {
            this._logInfoMessage(message);
        }
    }

    error(message, chat) {
        if (chat) {
            this._logErrorMessage(`${message}, ${this.getUserLog(chat)}`);
        } else {
            this._logErrorMessage(message);
        }
    }

    getUserLog(chat) {
        if (!chat) {
            return '';
        }
        return `user id: ${chat.id}, user name: ${chat.username}`;
    }

    _buildLogMessage(message) {
        return `${new Date().toISOString()}. ${message}`;
    }

    _logInfoMessage(message) {
        console.log(this._buildLogMessage(message));
    }

    _lofErrorMessage(message) {
        console.error(this._buildLogMessage(message));
    }
}