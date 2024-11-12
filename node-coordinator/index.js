const express = require('express');
const cors = require('cors');
const { generateServer } = require('./socket-server');
const log = require('./logs');
const { registerClient, createInstance, sycnNodes, emitList } = require('./clients-enpoints');
require('dotenv').config()

const app = express()

app.use(express.json())

app.use(cors())

app.get('/', (req, res) => {
    log('Request get index.html');
    new Promise((resolve, reject) => setTimeout(resolve, 1000))
    .then(() => emitList());
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

app.use("../public", express.static("public"));

const server = generateServer(app);

app.post('/clients', registerClient);

app.get('/createInstance', createInstance);

app.put('/sycnNodes', sycnNodes);

server.listen(5000, () => {
    log('Server started on port 5000');
});
