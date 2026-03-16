const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const ArchivedChat = sequelize.define("archivedChat", {
  message: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER
  },
  groupId: {
    type: Sequelize.INTEGER
  }
});

module.exports = ArchivedChat;