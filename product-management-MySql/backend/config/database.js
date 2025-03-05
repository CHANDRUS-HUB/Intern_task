const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,       
  user: process.env.MYSQL_USER,      
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then((connection) => {
    console.log(" MySQL Connected Successfully!");
    connection.release();
  })
  .catch((err) => {
    console.error("MySQL Connection Failed:", err);
  });


process.on("SIGINT", async () => {
  console.log(" Closing MySQL Connection ...");
  await pool.end();
  console.log(" MySQL Connection  Closed.");
  process.exit(0);
});

module.exports = pool;
