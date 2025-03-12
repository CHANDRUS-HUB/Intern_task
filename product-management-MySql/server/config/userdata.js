require('dotenv').config(); // Add this line to load .env variables

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: "localhost",        // Ensure this matches your MySQL host
        dialect: "mysql",
        logging: false            // Disable logs for cleaner output
    }
);

sequelize.authenticate()
    .then(() => console.log("✅ Database connected successfully!"))
    .catch((err) => console.error("❌ Error connecting to the database:", err));

module.exports = sequelize;
