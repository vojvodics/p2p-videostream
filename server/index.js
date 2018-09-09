const path = require('path');
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// the list of users
users = [];

app.use(express.static(path.join(__dirname, '../client/build')));

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('registration', function(user) {
    users.push(user);
    console.log(users);
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

server.listen(3000);
console.log('Working...');
