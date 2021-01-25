var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var path = require('path');

app.use(express.static(path.join(__dirname,'./public')));
app.get('/', (req, res) => {
res.sendFile(__dirname + '/public/index.html');
});

var name;

io.on('connection', (socket) => {
console.log('Novo usuario conectado');

socket.on('joining msg', (username) => {
    name = username;
    io.emit('chat message', `---${name} entrou no chat---`);
});

socket.on('disconnect', () => {
    console.log('Novo usuario');
    io.emit('chat message', `---${name} saiu do chat ---`);
    
});

socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);
});

socket.on('pause', (usr) => {
    io.emit('chat message', `${name} pausou!!`);
    socket.broadcast.emit('pauseg', usr);
});
socket.on('play', (usr) => {
    io.emit('chat message', `${name} deu play!`);
    socket.broadcast.emit('playg', usr);
});
socket.on('syncar', (obj) => {
    io.emit('chat message', `${name} Esta sincronizando!`);
    socket.broadcast.emit('sett', obj.time);
    socket.broadcast.emit('playg', obj.name);
});

});

server.listen(3000, () => {
console.log('Servidor rodando :3000');
});
