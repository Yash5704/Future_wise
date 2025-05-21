const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('userdb', 'root', 'yash1234', {
  port: 3306,
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
