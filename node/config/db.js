// services/database.js
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: "mysql",
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false
  }
);

const models = {};

// Load models dynamically
fs.readdirSync(__dirname + "/../models")
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const model = require(path.join(__dirname + "/../models", file))(
      sequelize,
      DataTypes
    );
    models[model.name] = model;
  });

// Apply associations if needed
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

console.log(models);

sequelize
  .sync({})
  .then(() => {
    console.log("Database and tables synced.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

module.exports = { sequelize, models };
