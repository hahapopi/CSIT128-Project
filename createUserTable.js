var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "userData",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  // Create employee table.
  var sql_table =
    "CREATE TABLE user (user_id INT PRIMARY KEY auto_increment, " +
    "user_email  VARCHAR(255) unique," +
    "user_username VARCHAR(50)," +
    "user_password VARCHAR(50))";
  con.query(sql_table, function (err, result) {
    if (err) throw err;
    console.log("User Table created");
  });
});
