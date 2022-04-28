//Imports
var express = require("express");
var bodyParser = require("body-parser");
var apiRouter = require("./apiRouter").router;
const path = require("path");

// Instance server
var server = express();

// Body Parser configuration
server.use("/images", express.static(path.join(__dirname, "images")));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// config
server.use("/", (req, res, next) => {
  // res.setHeader("Content-Type", "text/html");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

server.use("/api/", apiRouter);

// Launch server
server.listen(8080, function () {
  console.log("serveur actif :)");
});

module.exports = server;
