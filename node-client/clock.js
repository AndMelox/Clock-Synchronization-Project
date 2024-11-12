let date = null;

function getTime() {
    if (!date) {
        initClock();
    }
    date.setTime(date.getTime() + 1000);
    return { clockMillis: date.getTime() };
}

function getTimeNoChanged() {
    if (!date) {
        initClock();
    }
    return { clockMillis: date.getTime() };
}

function changeClock(adjust = 0) {
    date.setTime(date.getTime() + adjust);
}

function initClock(){
    date = new Date();
    const dif = Math.floor(Math.random() * 17);
    date.setTime(date.getTime() + (dif * (Math.random() < 0.5 ? -1 : 1) * 1000));
}

module.exports = {
    getTime,
    getTimeNoChanged,
    changeClock
}
