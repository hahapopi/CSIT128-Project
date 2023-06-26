var http = require("http");
var url = require("url");
var fs = require("fs");
var main = require("./main");
var session = require("./session");
querystring = require("querystring");
var cssDir = "./css/";
var imageDir = "./img/";
var productDir = "./img/products/";

http
  .createServer(function (req, res) {
    var body = "";
    var s;
    var query = url.parse(req.url, true).query;

    if (query.css !== undefined) {
      fs.readFile(cssDir + query.css, function (err, content) {
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
    if (req.url == "/login") {
      // read chunks of POST data
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      // when complete POST data is received
      req.on("end", () => {
        // use parse() method
        body = querystring.parse(body);

        // Authonticate user credentials.
        main.authenticateUser(
          res,
          body,
          session,
          main.postAuthentication,
          query
        );
      });
    } else if (req.url == "/navRegister") {
      main.register(res);
    } else if (req.url == "/navLogin") {
      main.login(res);
    } else if (req.url == "/register") {
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        body = querystring.parse(body);

        main.addUser(res, body);
      });
    } else if (req.url == "/logout") {
      s = session.getMySession();
      if (s !== undefined) {
        if (s.userName != "" && s.userName !== undefined) {
          session.deleteSession();
        }
      } else {
        // Redirect to the login page.
        main.login(res);
      }
      main.logout(res);
    } else if (req.url == "/home") {
      s = session.getMySession();
      if (s !== undefined) {
        if (s.userName != "" && s.userName !== undefined) {
          main.navigateToHome(res, s);
        }
      } else {
        // Redirect to the login page.
        main.login(res);
      }
    } else if (req.url == "/cart") {
      console.log("im here");
      s = session.getMySession();
      if (s !== undefined) {
        if (s.userName != "" && s.userName !== undefined) {
          main.navigateToCart(res, s);
        }
      }
    } else if (req.url == "/cartInfo") {
      s = session.getMySession();
      if (s !== undefined) {
        if (s.userName != "" && s.userName !== undefined) {
          main.getCart(res, s);
        }
      }
    } else if (req.url == "/shop") {
      s = session.getMySession();
      if (s !== undefined) {
        if (s.userName != "" && s.userName !== undefined) {
          main.navigateMaleShop(res, s);
        }
      }
    } else if (req.url == "/shop2") {
      s = session.getMySession();
      if (s !== undefined) {
        if (s.userName != "" && s.userName !== undefined) {
          main.navigateToFemaleShop(res, s);
        }
      }
    } else if (
      new URL(req.url || "", `https://${req.headers.host}`).pathname ==
      "/sproduct"
    ) {
      console.log("im here 24");
      s = session.getMySession();
      if (s !== undefined) {
        if (s.userName != "" && s.userName !== undefined) {
          main.navigateToSProduct(res, s, query);
        }
      }
    } else {
      // Login page.
      main.login(res);
    }
  })
  .listen(8080, () => {
    console.log("Listening on port 8080");
  });
