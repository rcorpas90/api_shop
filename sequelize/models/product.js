const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('product', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.REAL,
      allowNull: false
    },
    real_amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reserved_amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    image1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image3: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image4: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image5: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rating: {
      type: DataTypes.REAL,
      allowNull: true
    },
    id_department: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'department',
        key: 'id'
      }
    },
  }, {
    sequelize,
    tableName: 'product',
    timestamps: true
  });
};