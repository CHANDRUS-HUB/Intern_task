const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
    old_stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    consumed: { type: DataTypes.INTEGER, defaultValue: 0 },
    in_hand_stock: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      defaultValue: 0 
    },
  },
  {
    tableName: "products",
    timestamps: false, // Disable createdAt & updatedAt
  }
);

module.exports = Product;
