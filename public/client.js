// initialize socket.io
var socket = io();

// define document elements
var messageInput = document.getElementById("message-input");
var usernameInput = document.getElementById("username-input");
var chatArea = document.getElementById("chat-area");

// define global variables
var user = {};

// send a message
function sendMessage() {
  var message = messageInput.value;

  // if the input field isn't blank, add the message element to the page and emit 'new message' to the server
  if (message) {
    // object with message information
    messageInfo = {
      username: user.name,
      message: message
    }

    addChatMessage(messageInfo);
    messageInput.value = "";

    // send the message to the server
    socket.emit('new message', messageInfo);
  }
}

// set username
function setUsername() {
  // if the username field isn't blank, set the username property
  if (usernameInput.value) {
    user.name = usernameInput.value;
  }
}

// adds message element to page
function addChatMessage (data, options) {
  console.log(data);
  messageDiv = document.createElement("DIV");
  messageDiv.setAttribute("class", "message-div");
  usernameText = document.createElement("P");
  usernameText.setAttribute("class", "username-text");
  usernameText.innerHTML = data.username;
  messageText = document.createElement("P");
  messageText.innerHTML = data.message;
  messageDiv.appendChild(usernameText);
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
