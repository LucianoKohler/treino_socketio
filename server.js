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
      if(socket.nickname){
        io.emit('user disconnect', socket.nickname)
        console.log('Usuário deslogado: ' + socket.nickname)
      }else console.log('Guest deslogado');
    });

    socket.on('chat message', (msg) =>{ //Esse 'chat message' está no client side, dê uma olhada lá
        io.emit('chat message', {msg: msg, nick: socket.nickname,})
        // console.log('Mensagem escrita: ' + msg);
    })
  });

  let port = 3000
server.listen(port, () => {

  console.log('Servidor aberto em: \u001b[1;36mhttp://localhost:'+port+'\u001b[0m');
  //esse \u001b[1;36m é usado para deixar o console ciano, e o \u001b[0m é para deixar o console branco de volta.
});

