const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("message", {

  message: {
    type: Sequelize.STRING,
    allowNull: false
  },

  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }

});

module.exports = Message;