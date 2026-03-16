const User = require("../../models/user");

function chatHandler(io, socket) {

  socket.on("sendMessage", async (data) => {

    try {

      const { message, userId, roomId } = data;

      const user = await User.findByPk(userId);

      if (!user) {
        console.log("User not found");
        return;
      }

      const messageData = {
        message: message,
        userId: userId,
        name: user.name
      };

      // send only to room
      if (roomId) {
        io.to(roomId).emit("receiveMessage", messageData);
      } else {
        io.emit("receiveMessage", messageData);
      }

    } catch (err) {

      console.log("Chat error:", err);

    }

  });

}

module.exports = chatHandler;