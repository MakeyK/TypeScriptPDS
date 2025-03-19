const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./db');
const cors = require('cors');
const routes_createDB = require('./routers/index');
const http = require('http');

dotenv.config();
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

app.use('/mak', routes_createDB);
const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        server.listen(PORT, () => console.log(`Сервер работает на ${HOST}:${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
};
start();
