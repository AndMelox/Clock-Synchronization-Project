function putTitle() {
    const title = document.getElementById('title');
    title.innerText = `Instancia ${document.location.hostname}:${document.location.port}`;
}

putTitle();

const socket = io();

socket.on('clock', data => {
    const date = new Date(data.clockMillis);
    const clock = document.getElementById('clock');
    clock.innerText = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
})