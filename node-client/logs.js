const { getTimeNoChanged } = require("./clock");

let count = 0;

function log(info, isError = false) {
    const date = new Date(getTimeNoChanged().clockMillis);
    const dateFormat = date.toISOString();
    count++;
    if (isError) {
        console.error(`[${dateFormat}] [ERROR] Event ${count} -> ${info}`);
        return;
    }
    console.log(`[${dateFormat}] [INFO] Event ${count} -> ${info}`);
}

module.exports = log;