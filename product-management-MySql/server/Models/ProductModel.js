const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./CategoryModel");

const Product = sequelize.define("Product", {
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false, defaultValue: "General" },
  old_stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  new_stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  unit: { type: DataTypes.STRING, allowNull: false },
  consumed: { type: DataTypes.INTEGER, defaultValue: 0 },
  in_hand_stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { 
  timestamps: true,
  hooks: {
    beforeCreate: async (product) => {
      try {
        
        if (!product.name || !product.unit || product.new_stock === undefined || product.consumed === undefined) {
          throw new Error("All fields are required!");
        }

       
        if (!product.category || product.category === "General") {
          const categories = await Category.findAll();
          const productName = product.name.toLowerCase();
          let matchedCategory = "General";

          for (const category of categories) {
            try {
              const keywords = category.keywords ? JSON.parse(category.keywords) : [];
              if (Array.isArray(keywords) && keywords.some(keyword => productName.includes(keyword))) {
                matchedCategory = category.name;
                break;
              }
            } catch (error) {
              console.error("Error parsing keywords for category:", category.name, error);
            }
          }

          product.category = matchedCategory;
        }

      
        product.in_hand_stock = product.old_stock + product.new_stock - product.consumed;
      } catch (error) {
        console.error("Error in beforeCreate hook:", error.message);
        throw error; 
      }
    }
  }
});

module.exports = Product;
