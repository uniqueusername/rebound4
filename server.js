// configuration
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log('Server listening at port %d', port);
});

// routing
app.use(express.static(path.join(__dirname, 'public')));

// chatroom
users = {};

io.on('connection', function(socket) {

  // client emits a message
  socket.on('new message', function(data) {
    if (data.message == "" || data.message.split(" ").join("") == "" || data.message.includes("<") || data.message.includes(">") || data.message.includes("　")) {
      return;
    } else if (data.username == "" || data.username.split(" ").join("") == "" || data.username.includes("<") || data.username.includes(">") || data.username.includes("　")) {
      data.username = "mlg ghost hackerman";
      socket.broadcast.emit('new message', data);
    } else {
      socket.broadcast.emit('new message', data);
    }
  });

  socket.on('new connection', function(username) {
    users[socket.client.conn.id] = { username: username };

    // compile user roster
    var userSockets = Object.keys(users);
    var userRoster = [];
    for (var i = 0; i < userSockets.length; i++) {
      userRoster.push(users[userSockets[i]].username);
    }

    socket.emit('send roster', userRoster);
    socket.broadcast.emit('new connection', username);
  });

  socket.on('disconnect', function() {
    if (users[socket.client.conn.id] != undefined) {
      socket.broadcast.emit('user disconnected', users[socket.client.conn.id].username);
      delete users[socket.client.conn.id];
    } else {
      return;
    }
  });

});
