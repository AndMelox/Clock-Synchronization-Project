function createClient() {
    const button = document.getElementById('createBtn');
    button.disabled = true;
    fetch('http://10.4.73.143:5000/createInstance')
    .then(res => res.json())
    .then(res => {
        button.disabled = false;
        if(res.error) {
            alert(res.error);
            return;
        }
        alert(`Instancia creada, ip: ${res.ip}, puerto: ${res.port}`);
    })
    .catch(err => {
        button.disabled = false;
        alert(err.message);
    });
}

function syncClients() {
    const button = document.getElementById('syncBtn');
    button.disabled = true;
    fetch('http://10.4.73.143:5000/sycnNodes', { method: 'PUT' })
    .then(res => res.json())
    .then(res => {
        button.disabled = false;
        if(res.error) {
            alert(res.error);
            return;
        }
        alert(res.message);
    })
    .catch(err => {
        button.disabled = false;
        alert(err.message);
    });
}

const socket = io();

socket.on('clientsList', data => {
    const clientsList = document.getElementById('clientsList');
    clientsList.innerHTML = '';
    if (data.length === 0) {
        clientsList.innerHTML = 'No hay nodos registrados';
        return;
    }
    data.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('row', 'card', 'd-flex', 'flex-column', 'gap-2', 'my-2', 'mx-4', 'bg-dark', 'text-white', 'border-primary');
        div.innerHTML = `<p>IP: ${item.ip}</p>
        <p>PUERTO: ${item.port}</p>`;
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary');
        button.innerHTML = 'Ver reloj de nodo';
        button.addEventListener('click', () => {
            window.open(`http://${item.ip}:${item.port}`);
        });
        div.appendChild(button);
        clientsList.appendChild(div);
    });
})

socket.on('logsList', data => {
    const logs = document.getElementById('logs');
    logs.value = '';
    data.forEach(item => {
        logs.value += item.value + '\n';
    });
})
