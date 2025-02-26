const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Product_Management", "newuser", "password123", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // Disable logging
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((err) => console.error("Error connecting to database:", err));

// ✅ Sync database to automatically create tables
sequelize.sync({ alter: true }) // `alter: true` updates table structure if changed
  .then(() => console.log("Database synced. Tables created if missing."))
  .catch((err) => console.error("Error syncing database:", err));

module.exports = sequelize;
