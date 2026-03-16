const token = localStorage.getItem("token");
const myUserId = localStorage.getItem("userId");
const myName = localStorage.getItem("name");
const myEmail = localStorage.getItem("email");

const socket = io("https://group-chat-app-ready.onrender.com", {
  auth: { token }
});

let currentGroup = "";
let currentRoom = "";

/* SOCKET EVENTS */

socket.on("receive_group_message", (data) => {
  displayMessage(data);
});

socket.on("receive_message", (data) => {
  displayMessage(data);
});


/* JOIN GROUP */

function joinGroup(){

  const groupInput = document.getElementById("groupName");
  const groupName = groupInput.value.trim();

  if(!groupName){
    alert("Enter group name");
    return;
  }

  currentGroup = groupName;
  currentRoom = "";

  socket.emit("join_group", groupName);

  alert("Joined group: " + groupName);

  groupInput.value="";
}


/* JOIN PERSONAL CHAT */

async function joinRoom(){

  const email = document
    .getElementById("searchEmail")
    .value
    .trim();

  if(!email){
    alert("Enter email");
    return;
  }

  try{

    const res = await fetch(`https://group-chat-app-ready.onrender.com/search-user?email=${email}`);
    const data = await res.json();

    if(!data.user){
      alert("User not found");
      return;
    }

    const otherEmail = data.user.email;

    const roomId = [myEmail, otherEmail]
      .sort()
      .join("_");

    currentRoom = roomId;
    currentGroup = "";

    socket.emit("join_room", roomId);

    alert("Chat started with " + otherEmail);

  }catch(err){

    console.log(err);
    alert("Error joining chat");

  }

}


/* SEND MESSAGE */

async function send(){

  const input = document.getElementById("messageInput");
  const fileInput = document.getElementById("mediaFile");

  const message = input.value.trim();
  const file = fileInput.files[0];

  let finalMessage = message;

  /* FILE UPLOAD */

  if(file){

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://group-chat-app-ready.onrender.com/upload-media",{
      method:"POST",
      body:formData
    });

    const data = await res.json();

    finalMessage = data.url;

    fileInput.value="";

  }

  if(!finalMessage){
    alert("Enter message or upload file");
    return;
  }

  const messageData = {
    senderId: myUserId,
    senderName: myName,
    message: finalMessage
  };

  if(currentGroup){

    messageData.groupId = currentGroup;
    socket.emit("group_message", messageData);

  }

  else if(currentRoom){

    messageData.roomId = currentRoom;
    socket.emit("new_message", messageData);

  }

  else{

    alert("Join group or chat first");
    return;

  }

  input.value="";

}




async function send(){

  const input = document.getElementById("messageInput");
  const fileInput = document.getElementById("mediaFile");

  const message = input.value.trim();
  const file = fileInput.files[0];

  let finalMessage = message;

  /* FILE UPLOAD */

  if(file){

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://group-chat-app-ready.onrender.com/upload-media",{
      method:"POST",
      body:formData
    });

    const data = await res.json();

    finalMessage = data.url;

    fileInput.value="";

  }

  if(!finalMessage){
    alert("Enter message or upload file");
    return;
  }

  const messageData = {
    senderId: myUserId,
    senderName: myName,
    message: finalMessage
  };

  if(currentGroup){

    messageData.groupId = currentGroup;
    socket.emit("group_message", messageData);

  }

  else if(currentRoom){

    messageData.roomId = currentRoom;
    socket.emit("new_message", messageData);

  }

  else{

    alert("Join group or chat first");
    return;

  }

  input.value="";

}



function showSuggestions(words){

  const box = document.getElementById("suggestions");

  box.innerHTML = "";

  words.forEach(word => {

    const btn = document.createElement("button");

    btn.innerText = word;

    btn.onclick = () => {
      document.getElementById("messageInput").value += " " + word;
    };

    box.appendChild(btn);

  });

}

/* DISPLAY MESSAGE */

function displayMessage(data){

  const messageContainer = document.getElementById("chat-box");

  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message");

  if(String(data.senderId) === String(myUserId)){
    messageDiv.classList.add("sent");
  }else{
    messageDiv.classList.add("received");
  }

  if(data.message && data.message.startsWith("https")){

    const url = data.message;

    if(url.match(/\.(jpg|jpeg|png|gif)$/i)){

      messageDiv.innerHTML =
      `<b>${data.senderName}</b><br>
      <img src="${url}" width="200">`;

    }

    else if(url.match(/\.(mp4|webm)$/i)){

      messageDiv.innerHTML =
      `<b>${data.senderName}</b><br>
      <video controls src="${url}" width="200"></video>`;

    }

    else{

      messageDiv.innerHTML =
      `<b>${data.senderName}</b><br>
      <a href="${url}" target="_blank">Download File</a>`;

    }

  }

  else{

    messageDiv.innerHTML = `<b>${data.senderName}</b>: ${data.message}`;

  }

  messageContainer.appendChild(messageDiv);

  messageContainer.scrollTop = messageContainer.scrollHeight;

}


/* FILE NAME */

function showFileName(){

  const fileInput = document.getElementById("mediaFile");
  const fileNameDisplay = document.getElementById("fileName");

  if(fileInput.files.length > 0){
    fileNameDisplay.textContent = fileInput.files[0].name;
  }else{
    fileNameDisplay.textContent = "";
  }

}


/* ENTER TO SEND */

document
.getElementById("messageInput")
.addEventListener("keypress",function(e){

  if(e.key === "Enter"){
    send();
  }

});