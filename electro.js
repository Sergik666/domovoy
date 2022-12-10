require('dotenv').config();
const axios = require("axios");

module.exports = class Electro {

    async getStatus() {
        const status = await axios.get(process.env.ELECTRO_STATUS_API_URL);
        return status?.data;
    }

}