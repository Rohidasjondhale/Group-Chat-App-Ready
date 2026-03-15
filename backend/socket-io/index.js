const { Server } = require("socket.io");

const chatHandler = require("./handlers/chat");
const personalChat = require("./handlers/personalChat");
const groupChat = require("./handlers/groupChat");

function initializeSocket(server){

  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    chatHandler(io, socket);
    personalChat(io, socket);
    groupChat(io, socket);

    socket.on("disconnect", () => {

      console.log("User disconnected:", socket.id);

    });

  });

}

module.exports = initializeSocket;
