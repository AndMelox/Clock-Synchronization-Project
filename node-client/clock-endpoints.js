const log = require('./logs');
const { changeClock, getTimeNoChanged } = require('./clock');

function getClock(req, res) {
    log('Request to get clock received');
    const currentTime = getTimeNoChanged();
    log(`Current time: ${new Date(currentTime.clockMillis).toISOString()}`);
    res.json(currentTime);
}

function register(port, ip, registerIp) {
    fetch(`http://${registerIp}:5000/clients`, {
        method: 'POST',
        body: JSON.stringify({ port, ip }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch((err) => {
        log(`Failed to register client at ${registerIp}, error: ${err.message}`, true);
    });
}

function updateClock(req, res) {
    const adjust = req.body.adjust;
    log(`Request to update clock received, adjustment: ${adjust} ms`);
    changeClock(adjust);
    const updatedTime = getTimeNoChanged();
    log(`Updated time: ${new Date(updatedTime.clockMillis).toISOString()}`);
    res.json(updatedTime);
}

module.exports = {
    getClock,
    updateClock,
    register
}