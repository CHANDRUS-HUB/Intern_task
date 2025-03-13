require('dotenv').config(); 

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: "localhost",        
        dialect: "mysql",
        logging: false           
    }
);

sequelize.authenticate()
    .then(() => console.log("Database connected successfully!"))
    .catch((err) => console.error("Error connecting to the database:", err));

module.exports = sequelize;
