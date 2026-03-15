const User = require("../../models/user");

function chatHandler(io, socket) {
  socket.on("sendMessage", async (data) => {
    try {
      const user = await User.findByPk(socket.userId || data.userId);

      if (!user) {
        console.log("User not found");
        return;
      }

      const messageData = {
        message: data.message,
        userId: socket.userId || data.userId,
        name: user.name
      };

      io.emit("receiveMessage", messageData);

    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = chatHandler;