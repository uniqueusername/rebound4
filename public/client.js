// initialize socket.io
var socket = io();

// define document elements
var messageInput = document.getElementById("message-input");
var usernameInput = document.getElementById("username-input");
var chatArea = document.getElementById("chat-area");
var userRoster = document.getElementById("user-roster");
var userRosterList = document.getElementById("user-roster-list");
var usernameOverlay = document.getElementById("username-overlay");

var backgrounds = ["https://i.imgur.com/oo8qslP.gif", "https://i.imgur.com/mhVYyuH.gif", "https://i.imgur.com/cY6deBb.gif", "https://i.imgur.com/8yqi7xF.gif", "https://i.imgur.com/liXwMRY.gif", "https://i.imgur.com/X6xVLmk.gif", "https://i.imgur.com/GSYoaDs.gif", "https://i.imgur.com/2J9z1Ue.gif", "https://i.imgur.com/TASTgLM.gif"]
messageInput.value = "";
usernameInput.value = "";
usernameInput.focus();
usernameOverlay.style.backgroundImage = `url(${backgrounds[Math.floor(Math.random() * backgrounds.length)]})`;
messageInput.value = "";

log("you have been connected to rebound.io");
log("there are x users online");

// define global variables
var user = {};
usernameSet = false;

// send a message
function sendMessage() {
  if (usernameSet == true) {
    var message = messageInput.value;

    if (message.includes("<") || message.includes(">")) {
      alert("The < and > tags are blacklisted to prevent markup and script injection. Your message was not sent.");
    } else if (message == "" || message.split(" ").join("") == "") {
      return;
    } else {
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
  }
}

// set username
function setUsername() {
  // if the username field isn't blank, set the username property
  if (usernameInput.value) {
    if (usernameInput.value.includes("<") || usernameInput.value.includes(">")) {
      alert("The < and > tags are blacklisted to prevent markup and script injection. Your username was not set.");
    } else if (usernameInput.value == "" || usernameInput.value.split(" ").join("") == "" || usernameInput.value == undefined) {
      return;
    } else {
      user.name = usernameInput.value;
      usernameSet = true;
      fadeUsernameOverlay();
      socket.emit('new connection', user.name);
    }
  }
}

// fade out the username overlay
function fadeUsernameOverlay() {
  messageInput.focus();
  usernameOverlay.style.opacity = 1;
  var usernameFade = setInterval(function() { usernameOverlay.style.opacity = usernameOverlay.style.opacity - 0.02; }, 1);
  setTimeout(function() { clearInterval(usernameFade); usernameOverlay.style.width = 0; usernameOverlay.removeChild(usernameInput); }, 1100);
}

// adds message element to page
function addChatMessage(data, options) {
  var isScrolledToBottom = chatArea.scrollHeight - chatArea.clientHeight <= chatArea.scrollTop + 1;

  messageDiv = document.createElement("DIV");
  messageDiv.setAttribute("class", "message-div");
  usernameText = document.createElement("span");
  usernameText.setAttribute("class", "username-text");
  usernameText.innerHTML = data.username;
  messageText = document.createElement("span");
  messageText.setAttribute("class", "message-text");
  messageText.innerHTML = data.message;
  messageDiv.appendChild(usernameText);
  messageDiv.appendChild(messageText);
  chatArea.appendChild(messageDiv);

  // scroll page only if user has not scrolled up
  if (isScrolledToBottom == true) {
    chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight;
  }
}

function log(message) {
  var isScrolledToBottom = chatArea.scrollHeight - chatArea.clientHeight <= chatArea.scrollTop + 1;

  messageDiv = document.createElement("DIV");
  messageDiv.setAttribute("class", "message-div-log");
  logText = document.createElement("span");
  logText.setAttribute("class", "log-text");
  logText.innerHTML = message;
  messageDiv.appendChild(logText);
  chatArea.appendChild(messageDiv);
}

function addUserToRoster(roster) {
  for (var i = 0; i < roster.length; i++) {
    messageDiv = document.createElement("DIV");
    messageDiv.setAttribute("class", "message-div");
    messageDiv.setAttribute("id", "user" + roster[i]);
    messageDiv.style.width = "20vw";
    rosterText = document.createElement("li");
    rosterText.setAttribute("class", "roster-text");
    rosterText.innerHTML = roster[i];
    messageDiv.appendChild(rosterText);
    userRosterList.appendChild(messageDiv);
  }
}

// check for enter keypress
document.onkeypress = function(e) {
  if (e.keyCode == 13) {
    if (usernameSet == true) {
      sendMessage();
    } else {
      setUsername()
      messageInput.value = "";
    }
  }
}

socket.on('new message', function(data) {
  addChatMessage(data);
});

socket.on('new connection', function(username) {
  log(username + " has connected");
  addUserToRoster([username]);
});

socket.on('user disconnected', function(username) {
  log(username + " has disconnected");
  console.log(username);
  userRosterList.removeChild(document.getElementById("user" + username));
});

socket.on('send roster', function(roster, usernames) {
  addUserToRoster(roster, usernames);
})
