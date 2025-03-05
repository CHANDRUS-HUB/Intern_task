const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  keywords: {
    type: DataTypes.JSON, 
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Category;
