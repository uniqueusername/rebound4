// initialize socket.io
var socket = io();

// define document elements
var messageInput = document.getElementById("message-input");
var chatArea = document.getElementById("chat-area");

// send a message
function sendMessage() {
  var message = messageInput.value;

  // if the input field isn't blank, add the message element to the page and emit 'new message' to the server
  if (message) {
    addChatMessage({
      message: message
    });
    messageInput.value = "";

    // send the message to the server
    socket.emit('new message', message);
  }
}

// adds message element to page
function addChatMessage (data, options) {
  messageDiv = document.createElement("DIV");
  messageDiv.setAttribute("class", "message-div");
  messageText = document.createTextNode(data.message);
  messageDiv.appendChild(messageText);
  chatArea.appendChild(messageDiv);
}

// check for enter keypress
document.onkeypress = function(e) {
  if (e.keyCode == 13) {
    sendMessage()
  }
}

socket.on('new message', function (data) {
  addChatMessage(data);
});
