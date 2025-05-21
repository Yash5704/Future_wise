// models/index.js
const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js');
const sequelizeConfig = config[env];

// Sequelize instance
const sequelize = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  sequelizeConfig
);

const Course = require('./Course'); // Import the model here

module.exports = { sequelize, Course }; // Export both sequelize instance and models
