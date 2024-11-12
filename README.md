# Clock Synchronization Project

This project consists of two main components: `node-client` and `node-coordinator`. The goal is to synchronize the clocks of multiple `node-client` instances using a `node-coordinator`.

## Project Structure

node-client/ ├── clock-endpoints.js ├── clock.js ├── Dockerfile ├── index.js ├── logs.js ├── package.json └── public/ ├── index.html └── index.js

node-coordinator/ ├── .env ├── clients-endpoints.js ├── index.js ├── logs.js ├── package.json └── public/ ├── index.html ├── index.js └── socket-server.js


## Setup

### 1. Configure IP Addresses

1. Open the `.env` file in the `node-coordinator` folder and change the IP to your machine's IP address.

2. Open the `index.js` file in the `node-coordinator/public` folder and replace the IP with your machine's IP address:

    ```javascript
    fetch('http://your_ip:5000/createInstance')
    fetch('http://your_ip:5000/syncNodes', { method: 'PUT' })
    ```

### 2. Build and Run Containers

#### node-client
1. Navigate to the `node-client` folder:
    ```bash
    cd node-client
    ```

2. Build the Docker image:
    ```bash
    docker build -t node-client .
    ```

#### node-coordinator
1. Navigate to the `node-coordinator` folder:
    ```bash
    cd node-coordinator
    ```

2. Install dependencies and start the server:
    ```bash
    npm install
    npm start
    ```

### 3. Open in Browser

Open your browser and go to `http://your_ip:5000` to view the `node-coordinator` interface.

## Features

- **node-client**: Provides endpoints to get and update the clock of each instance.
- **node-coordinator**: Coordinates clock synchronization across multiple `node-client` instances.

## Endpoints

### node-client

- `GET /clock`: Retrieves the current time of the clock.
- `PUT /clock`: Updates the clock with a specified adjustment.

### node-coordinator

- `POST /clients`: Registers a new client.
- `GET /createInstance`: Creates a new `node-client` instance.
- `PUT /syncNodes`: Synchronizes the clocks of all registered instances.

## Notes

- Ensure that Docker is installed and running on your machine.
- Make sure the configured IP addresses are accessible on your network.


## Authors

[<img alt="GitHub" src="https://img.shields.io/badge/GitHub-@AndMelox-181717?style=flat-square&logo=github">](https://github.com/AndMelox)  
[<img alt="GitHub" src="https://img.shields.io/badge/GitHub-@sebastian11020-181717?style=flat-square&logo=github">](https://github.com/sebastian11020)  
[<img alt="GitHub" src="https://img.shields.io/badge/GitHub-@SamVargasGit-181717?style=flat-square&logo=github">](https://github.com/SamVargasGit)


## 🔗 Contact Links

<img alt="instagram" src="https://img.shields.io/badge/instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white"> 
<img alt="linkedin" src="https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"> 
<img alt="gmail" src="https://img.shields.io/badge/gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"> 
<img alt="twitter" src="https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white"> ```
