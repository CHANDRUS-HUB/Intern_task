const mysql = require("mysql2");

// Create MySQL connection pool
const pool = mysql.createPool({
    host: "localhost",  // Change if using a different database server
    user: "root",       // Your MySQL username
    password: "",       // Your MySQL password
    database: "your_database_name",  // Replace with your actual database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promisify pool for async/await
const promisePool = pool.promise();
module.exports = promisePool;
