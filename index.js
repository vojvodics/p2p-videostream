const path = require('path');
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// the list of users
users = new Map();

app.use(express.static(path.join(__dirname, '/client/build')));

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('registration', function(user) {
    users.set(user.id, user);
    socket.user = user.id;
    io.sockets.emit('updateUsers', Array.from(users.values()));
    console.log(users);
  });

  socket.on('disconnect', () => {
    users.delete(socket.user);
    io.sockets.emit('updateUsers', Array.from(users.values()));
    console.log('user disconnected', socket.user, Array.from(users.values()));
  });
});

server.listen(process.env.PORT || 3001);
console.log('Working...');
