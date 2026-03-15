const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("user", {

  name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  email: {
    type: Sequelize.STRING,
    unique: true
  },

  phone: {
    type: Sequelize.STRING,
    unique: true
  },

  password: {
    type: Sequelize.STRING
  }

});

module.exports = User;