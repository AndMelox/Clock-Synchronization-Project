const log = require("./logs");
const { getSocket } = require("./socket-server");
const Docker = require('dockerode');

const docker = new Docker();

const list = [];

function registerClient(req, res) {
    const ip = req.body.ip;
    const port = req.body.port;
    list.push({ ip, port });
    log('Request register client, data: ' + JSON.stringify(req.body));
    getSocket().emit('clientsList', list);
    log('Emiting list of node-clients');
    res.json({ ip, port });
}

async function createInstance(req, res) {
    log('Request create instance');
    let port = Math.floor(Math.random() * 2000) + 2000;
    while (list.some(item => item.port === port)) {
        port = Math.floor(Math.random() * 2000) + 2000;
    }
    const ip = process.env.IP || 'localhost';
    const success = await createContainer(ip, port);
    if (success) {
        log('Container created, ip: ' + ip + ', port: ' + port);
        res.json({ ip, port });
    } else {
        log('Failed to create container', true);
        res.status(500).json({ error: 'Failed to create container' });
    }
}

async function sycnNodes(req, res) {
    log('Request sync nodes');
    await syncList(res);
}

async function syncList(res) {
    const data = await getDataClock();
    if (!data[0]) {
        log('Failed to sync clock', true);
        res.status(500).json({ error: 'Failed to sync clock' });
        return;
    }
    const dateToCompare = new Date();
    dateToCompare.setHours(data[0].hour, data[0].minute, data[0].seconds, data[0].milliSeconds);
    const listToSync = data[1].filter(item => item.millis);
    listToSync.forEach(item => {
        const date = new Date(item.millis);
        const dif = date.getTime() - dateToCompare.getTime();
        log('Dif: ' + dif);
        item.dif = dif;
    });
    const avgDif = listToSync.reduce((acc, item) => acc + item.dif, 0) / listToSync.length;
    log('Avg dif: ' + avgDif);
    listToSync.forEach(item => item.dif = avgDif - item.dif);
    await syncClocks(listToSync);
    log('Synced nodes');
    res.json({ message: 'Synced nodes' });
}

async function getDataClock() {
    const listToDelete = [];
    const requests = list.map((client, index) => new Promise(async (resolve, reject) => {
        const result = await fetch(`http://${client.ip}:${client.port}/clock`)
        .then(res => res.json())
        .catch(err => {
            log('Failed to get clock fom client '+ client.ip +' with port ' + client.port +', error: ' + err.message, true);
            listToDelete.push(index)
            return null;
        });
        const mls = result ? result.clockMillis : result;
        resolve({ millis: result.clockMillis, url: `http://${client.ip}:${client.port}/clock`, dif: 0 });
    }));
    const data = await Promise.all([
        new Promise(async (resolve, reject) => {
            const result = await fetch('https://timeapi.io/api/time/current/zone?timeZone=America%2FBogota')
            .then(res => res.json())
            .catch(err => {
                log('Failed to get time from timeapi, error: ' + err.message, true);
                return null;
            });
            resolve(result);
        }),
        new Promise(async (resolve, reject) => {
            const result = await Promise.all(requests);
            resolve(result);
    })]);
    listToDelete.forEach(index => list.splice(index, 1));
    if (listToDelete.length > 0) {
        emitList();
    }
    return data;
}

async function syncClocks(list) {
    const requests = list.map(item => new Promise(async (resolve, reject) => {
        await fetch(item.url, {
            method: 'PUT',
            body: JSON.stringify({ adjust: item.dif }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch((err) => {
            log('Failed to sync clock fom client '+ item.url +', error: ' + err.message, true);
        });
        resolve(true);
    }));
    await Promise.all(requests);
}

function emitList() {
    getSocket().emit('clientsList', list);
    log('Emiting list of node-clients');
}

async function createContainer(ip, port) {
    let success = false;
    await docker.createContainer({
        Image: 'node-client',
        ExposedPorts: {
            [`${port}/tcp`]: {}
        },
        HostConfig: {
            PortBindings: {
                [`${port}/tcp`]: [
                    {
                        HostPort: port.toString()
                    }
                ]
            },
            AutoRemove: true 
        },
        Env: [
            `PORT=${port}`,
            `IP=${ip}`,
            `REGISTER_IP=${ip}`,
        ],
        name: `node-client-${port}`
    }).then( (container) => {
        success = true;
        container.start((err, data) => {
            if (err) {
                success = false;
            }
        });
    });
    return success;
}

module.exports = {
    registerClient,
    createInstance,
    sycnNodes,
    emitList
}
