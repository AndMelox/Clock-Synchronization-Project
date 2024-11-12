const http = require('http');
const { Server } = require('socket.io');
const log = require('./logs');

let server = null;
let socket = null;

function generateServer(app) {
    if (!server) {
        createServer(app);
    }
    return server;
}

function getSocket() {
    return socket;
}

function createServer(app) {
    server = http.createServer(app);
    socket = new Server(server, { cors: {
    } });
    socket.on('connection',(client) => {
        log('A user connected');
        client.on('disconnect', () => {
            log('A user disconnected');
        });
    });
}


module.exports = {
    generateServer,
    getSocket
}
