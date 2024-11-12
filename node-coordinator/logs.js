let count = 0;
const logsList = [];
let serverSocket = null;

function log(info, isError = false) {
    const date = new Date();
    const dateFormat = date.toISOString(); // Formato ISO 8601
    count++;
    let logValue = '';
    if (isError) {
        logValue = `[${dateFormat}] [ERROR] Event ${count} -> ${info}`;
    } else {
        logValue = `[${dateFormat}] [INFO] Event ${count} -> ${info}`;
    }
    const log = {
        id: count,
        value: logValue,
    }
    console.log(log.value);
    logsList.push(log);
    if (!serverSocket) {
        const { getSocket } = require("./socket-server");
        serverSocket = getSocket();
    }
    serverSocket.emit('logsList', logsList);
}

module.exports = log;