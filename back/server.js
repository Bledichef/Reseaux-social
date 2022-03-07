//Imports
var express = require("express");
var bodyParser = require("body-parser");
var apiRouter = require("./apiRouter").router;

// Instance server
var server = express();

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// config
server.get("/", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send("<h1> Bienvenue sur le  serveur</h1>");
});

server.use("/api/", apiRouter);

// Launch server
server.listen(8080, function () {
  console.log("serveur actif :)");
});