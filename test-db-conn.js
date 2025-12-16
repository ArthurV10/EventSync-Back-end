const net = require('net');

const tryConnect = (host) => {
    console.log(`Connecting to ${host}:5432...`);
    const client = new net.Socket();
    client.setTimeout(2000);

    client.connect(5432, host, function () {
        console.log(`Successfully connected to ${host}:5432`);
        client.destroy();
    });

    client.on('error', function (err) {
        console.error(`Error connecting to ${host}:`, err.message);
    });

    client.on('timeout', function () {
        console.error(`Timeout connecting to ${host}`);
        client.destroy();
    });
};

tryConnect('127.0.0.1');
tryConnect('localhost');
