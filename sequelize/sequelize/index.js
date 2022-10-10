const {
  Sequelize
} = require('sequelize');
var DataTypes = require("sequelize").DataTypes;
const {
  applyExtraSetup
} = require('./extra-setup');
require('dotenv').config()

// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './bin/db/databaseShop.db',
  logging: false
});

const modelDefiners = [
  require("../models/user"),
  require("../models/department"),
  require("../models/product"),
  require("../models/request"),
  require("../models/request_product"),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize, DataTypes);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;