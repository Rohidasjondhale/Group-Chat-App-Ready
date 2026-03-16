const express = require("express");
require("dotenv").config();

const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");

const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const User = require("./models/user");
const Message = require("./models/message");

const mediaRoutes = require("./routes/mediaRoutes");

const initializeSocket = require("./socket-io");


const cron = require("node-cron");
const ArchivedChat = require("./models/archivedChat");
const { Op } = require("sequelize");

cron.schedule("0 0 * * *", async () => {

  console.log("Running chat archive job...");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const oldChats = await Chat.findAll({
    where: {
      createdAt: {
        [Op.lt]: yesterday
      }
    }
  });

  for (let chat of oldChats) {
    await ArchivedChat.create(chat.dataValues);
  }

  await Chat.destroy({
    where: {
      createdAt: {
        [Op.lt]: yesterday
      }
    }
  });

  console.log("Old chats archived successfully");

});


User.hasMany(Message);
Message.belongsTo(User);

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(userRoutes);
app.use(messageRoutes);
app.use(mediaRoutes);


const server = http.createServer(app);
// Initialize socket server
initializeSocket(server);

sequelize.sync()
.then(() => {

  server.listen(3000, () => {
    console.log("Server running on port 3000");
  });

})
.catch(err => console.log(err));