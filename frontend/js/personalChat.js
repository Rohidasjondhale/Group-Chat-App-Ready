// Connect to socket server
const socket = io("https://group-chat-app-ready.onrender.com");

// Logged-in user email
const myEmail = localStorage.getItem("email");

// Current active room
let currentRoomId = "";

// Join personal chat room
function joinRoom() {

  const otherEmail = document
    .getElementById("searchEmail")
    .value.trim()
    .toLowerCase();

  if (!otherEmail) {
    alert("Enter user email");
    return;
  }

  if (!myEmail) {
    alert("Login again. Email missing.");
    return;
  }

  // Create unique room id
  currentRoomId = [myEmail.toLowerCase(), otherEmail]
    .sort()
    .join("_");

  socket.emit("join_room", currentRoomId);

  console.log("Joined room:", currentRoomId);

  // clear old messages
  document.getElementById("chat-box").innerHTML = "";
}


// Send personal message
function sendMessage() {

  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (!message) return;

  if (!currentRoomId) {
    alert("Join a chat first");
    return;
  }

  const messageData = {
    roomId: currentRoomId,
    senderEmail: myEmail,
    message: message
  };

  socket.emit("new_message", messageData);

  displayMessage({
    senderEmail: myEmail,
    message: message,
    type: "sent"
  });

  input.value = "";
}


// Receive message from room
socket.on("receive_message", (data) => {

  const type =
    data.senderEmail === myEmail ? "sent" : "received";

  displayMessage({
    senderEmail: data.senderEmail,
    message: data.message,
    type: type
  });

});


// Display message in UI
function displayMessage(msg) {

  const chatBox = document.getElementById("chat-box");

  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message", msg.type);

  messageDiv.innerHTML = `
    <strong>${
      msg.type === "sent" ? "You" : msg.senderEmail
    }:</strong>
    <p>${msg.message}</p>
  `;

  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

}