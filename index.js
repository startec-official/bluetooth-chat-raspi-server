var cors = require('cors');
const app = require('express')();
const SerialPort = require('serialport')
const btPort = new SerialPort('/dev/rfcomm0', {
    baudRate: 57600
}).setEncoding('utf8');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
const port = 3002

app.get('/', (req, res) => {
    res.send('Hello life!')
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
    socket.on("reply-message", (msg) => {
        console.log(`msg: ${msg}`);
        btPort.write(msg + '\n');
    });
});

btPort.open(function (err) {
    console.log('port opened');
    btPort.on('data', function (data) {
        if (data.toString().indexOf('\n') < 0)
            io.emit('chat message', data);
    })
});

http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})