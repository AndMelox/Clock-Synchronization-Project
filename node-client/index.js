const express = require('express');
const cors = require('cors');
const { getClock, updateClock, register } = require('./clock-endpoints');
const { getTime } = require('./clock');
const log = require('./logs');
const http = require('http');
const { Server } = require('socket.io');

const app = express()

app.use(express.json())

app.use(cors())

app.get('/', (req, res) => {
    log(`[${new Date().toISOString()}] [INFO] Request to get index.html received`);
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

app.use("../public", express.static("public"));

const server = http.createServer(app);

const socket = new Server(server, { cors: {
} });

socket.on('connection',() => {
    log(`[${new Date().toISOString()}] [INFO] A user connected`);
    socket.on('disconnect', () => {
        log(`[${new Date().toISOString()}] [INFO] A user disconnected`);
    });
});

setInterval(() => {
    const time = getTime();
    socket.emit('clock', time);
    log(`[${new Date().toISOString()}] [INFO] Updating clock, data: ${JSON.stringify(time)}`);
}, 1000);

app.get('/clock', getClock);

app.put('/clock', updateClock);

const port = parseInt(process.env.PORT) || 3000;
const ip = process.env.IP || 'localhost';
const registerIp = process.env.REGISTER_IP || 'localhost';

server.listen(port, () => {
    log(`[${new Date().toISOString()}] [INFO] Server started on port ${port}`);
    register(port, ip, registerIp);
});