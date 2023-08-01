const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  let id = socket.id;

  socket.on('nick register', (nick) =>{
    io.emit('user connect', nick)
    socket.nickname = nick
    console.log('Usuário logado: ' + socket.nickname)
  })

    socket.on('disconnect', () => {
      io.emit('user disconnect', socket.nickname)
      console.log('Usuário deslogado: ' + socket.nickname);
    });

    socket.on('chat message', (msg) =>{ //Esse 'chat message' está no client side, dê uma olhada lá
        io.emit('chat message', {msg: msg, nick: socket.nickname,})
        // console.log('Mensagem escrita: ' + msg);
    })
  });

server.listen(3000, () => {
  console.log('listening on 3000');
});

