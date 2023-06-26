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
    "CREATE TABLE cart (cart_id int primary key auto_increment ,user_id INT, " +
    "item_name VARCHAR(255)," +
    "item_price decimal," +
    "item_qty int,  FOREIGN KEY (user_id) REFERENCES user(user_id))";
  con.query(sql_table, function (err, result) {
    if (err) throw err;
    console.log("Cart Table created");
  });
});
