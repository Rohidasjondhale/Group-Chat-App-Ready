const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const ArchivedChat = sequelize.define("ArchivedChat", {
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