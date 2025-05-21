const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yash1234",
  database: "userdb",
  port: 3306,
  connectTimeout: 10000,
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected!");
});
 
module.exports = db;
