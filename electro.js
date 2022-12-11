import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export default class Electro {

    async getStatus() {
        const status = await axios.get(process.env.ELECTRO_STATUS_API_URL);
        return status?.data;
    }

}