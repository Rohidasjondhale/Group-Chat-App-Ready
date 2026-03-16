const express = require("express");
require("dotenv").config();

const cors = require("cors");
const http = require("http");

const sequelize = require("./config/database");

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const aiRoutes = require("./routes/aiRoutes.js");

const User = require("./models/user");
const Message = require("./models/message");

const initializeSocket = require("./socket-io/index.js");

const cron = require("node-cron");
const ArchivedChat = require("./models/archivedChat.js");
const { Op } = require("sequelize");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/ai", aiRoutes);

app.use(userRoutes);
app.use(messageRoutes);
app.use(mediaRoutes);

User.hasMany(Message);
Message.belongsTo(User);

cron.schedule("0 0 * * *", async () => {

  try{

    console.log("Running chat archive job...");

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const oldChats = await Message.findAll({
      where:{
        createdAt:{
          [Op.lt]: yesterday
        }
      }
    });

    for(let chat of oldChats){
      await ArchivedChat.create(chat.dataValues);
    }

    await Message.destroy({
      where:{
        createdAt:{
          [Op.lt]: yesterday
        }
      }
    });

    console.log("Old chats archived successfully");

  }

  catch(err){
    console.log("Cron error:",err);
  }

});

const server = http.createServer(app);
initializeSocket(server);

const PORT = process.env.PORT || 3000;

sequelize.sync()
.then(()=>{

  server.listen(PORT,()=>{
    console.log("Server running on port "+PORT);
  });

})
.catch(err=>console.log(err));