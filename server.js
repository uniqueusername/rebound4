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
app.use(express. static(path.join(__dirname, 'public')));

// chatroom

var users = {};

io.on('connection', function(socket) {

  // client emits a message
  socket.on('new message', function(data) {
    socket.broadcast.emit('new message', {
      message: data
    });
  });

});
