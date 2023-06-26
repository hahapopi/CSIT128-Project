var mysql = require("mysql");
var fs = require("fs");
var con;

// This method is used to connect to the Database

exports.connectToDB = function () {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root", // provide your own password.
    database: "userData",
  });
  return con;
};
// The purpose of this method is to create the sessions and authorize the user.

exports.postAuthentication = function (res, mySess, userId, body) {
  if (userId != -1 && userId != "" && userId !== undefined) {
    mySess.setMySession(body.username);
    mySess.setUserIdSession(userId);
    s = mySess.getMySession();
    if (s.userName != "" && s.userName !== undefined) {
      // Redirect to the Home page.
      fs.readFile("home.html", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      });
    }
  }
};

// This method is used to login the user in the web application.

exports.login = function (res) {
  // to display error message if there is any.
  fs.readFile("login.html", function (err, data) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("404 Not Found");
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    return res.end();
  });
};

exports.register = function (res) {
  fs.readFile("register.html", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    return res.end();
  });
};
// This method is used to logout the user from the web application.

exports.logout = function (res) {
  fs.readFile("login.html", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    if (con != undefined && con != "") {
      con.destroy();
    }
    return res.end();
  });
};

// This method navigates the user to the Home page.

exports.navigateToHome = function (res, mySess) {
  fs.readFile("home.html", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    return res.end();
  });
};

// This method navigates the user to the male clothing page.

exports.navigateMaleShop = function (res, empObj, mySess) {
  fs.readFile("shop.html", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);

    return res.end();
  });
};

// This method navigates the user to female clothing page.

exports.navigateToFemaleShop = function (res, mySess, result) {
  fs.readFile("shop2.html", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    return res.end();
  });
};

exports.navigateToSProduct = function (res, mySess, query) {
  const imports = `<script>document.getElementById('item_seller').innerHTML = '${query.item_seller}';document.getElementById('item_name').innerHTML = '${query.item_name}';document.getElementById('item_price').innerHTML = '$${query.item_price}';</script>`;
  fs.readFile("sproduct.html", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    return res.end(imports);
  });
};

exports.navigateToCart = function (res, mySess, result) {
  fs.readFile("cart.html", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    return res.end();
  });
};

exports.getCart = function (res, mySess, result) {
  console.log("im here in get cart");
  let sql = `select * from cart where user_id=${mySess.userId}`;
  con.query(sql, function (err, result) {
    console.log("im here in get cart 2");
    res.writeHead(200, { "Content-type": "application/json" });
    if (err) res.end(JSON.stringify({ data: err.toString() }));
    else {
      res.end(JSON.stringify({ data: result }));
    }
  });
};

// This method authenticates user credentials

exports.authenticateUser = function (res, body, mySess, myCallback, query) {
  var username = body.username;
  var userPassword = body.password;

  var cssDir = "./css/";
  var imageDir = "./img/";

  if (query.css !== undefined) {
    file = query.css;
    fs.readFile(cssDir + file, function (err, content) {
      if (err) {
        console.log(err);
      } else {
        res.writeHead(200, { "Content-type": "text/css" });
        res.end(content);
      }
    });
  } else if (query.svg !== undefined) {
    file = query.svg;
    fs.readFile(imageDir + file, function (err, content) {
      if (err) {
        console.log(err);
      } else {
        res.writeHead(200, { "Content-type": "image/svg" });
        res.end(content);
      }
    });
  } else if (query.png !== undefined) {
    file = query.png;
    fs.readFile(imageDir + file, function (err, content) {
      if (err) {
        console.log(err);
      } else {
        res.writeHead(200, { "Content-type": "text/png" });
        res.end(content);
      }
    });
  } else if (query.jpg !== undefined) {
    file = query.jpg;
    fs.readFile(imageDir + file, function (err, content) {
      if (err) {
        console.log(err);
      } else {
        res.writeHead(200, { "Content-type": "text/jpg" });
        res.end(content);
      }
    });
  }

  // Connect to the database.
  con = this.connectToDB();
  con.connect(function (err) {
    if (err) throw err;
    // Get userData record.
    var sql =
      "SELECT * from user WHERE user_username = '" +
      username +
      "' AND user_password = '" +
      userPassword +
      "'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      if (result !== undefined && result.length > 0) {
        console.log(result);
        fs.readFile("home.html", function (err, data) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          return res.end();
        });
        myCallback(res, mySess, result[0].user_id, body);
      } else {
        // show error message on the login page.
        var message =
          '<script>document.getElementById("error_message").innerHTML = "You have entered an incorrect username or password!";</script> ';
        fs.readFile("login.html", function (err, data) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          return res.end(message);
        });
      }
    });
  });
};

// This method gets an userData record

exports.getUser = function (res, mySess, myCallback) {
  var sql = "SELECT * from userData WHERE user_id = " + mySess.userId;
  con.query(sql, function (err, result) {
    if (err) throw err;
    if (result !== undefined && result.length > 0) {
      myCallback(res, result, mySess); // result - userData object
    }
  });
};

// This method  adds an user's data to the database.

exports.addUser = function (res, body, mySess, myCallback) {
  var username = body.username;
  var userPassword = body.password;
  var userEmail = body.email;

  con = this.connectToDB();

  con.connect(function (err) {
    if (err) throw err;
    if (
      username !== undefined &&
      username !== undefined &&
      userPassword !== undefined
    ) {
      var sql =
        "INSERT INTO user (user_username,user_email,user_password) values ( '" +
        username +
        "','" +
        userEmail +
        "','" +
        userPassword +
        "'" +
        ")";

      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result !== undefined);
        if (result !== undefined) {
          console.log("Successfully registered data!");
          fs.readFile("login.html", function (err, data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            return res.end();
          });
        } else {
          var message =
            '<script>document.getElementById("error_message").innerHTML = "Please follow the required format!";</script> ';
          fs.readFile("register.html", function (err, data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            return res.end(message);
          });
        }
      });
    }
  });
};
