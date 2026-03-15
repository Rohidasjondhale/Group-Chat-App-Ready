const Message = require("../models/message");
const User = require("../models/user");

exports.sendMessage = async (req, res) => {

  try {

    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ message: "Message or userId missing" });
    }

    const newMessage = await Message.create({
      message,
      userId
    });

    res.status(201).json(newMessage);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error saving message" });

  }

};


exports.getMessages = async (req, res) => {

  try {

    const messages = await Message.findAll({
      include: {
        model: User,
        attributes: ["name"]
      },
      order: [["createdAt", "ASC"]]
    });

    res.status(200).json(messages);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error fetching messages" });

  }

};