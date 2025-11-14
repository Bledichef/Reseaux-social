//Imports
var express = require("express");
var bodyParser = require("body-parser");
var apiRouter = require("./apiRouter").router;
const path = require("path");
require("dotenv").config();
const mysql = require("mysql");
const config = require("./config/config.json")[process.env.NODE_ENV || "development"];
var models = require("./models");

// Instance server
var server = express();

// Configuration CORS - DOIT être en premier
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - CORS middleware`);
  
  // Définir tous les headers CORS AVANT de vérifier OPTIONS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  // Répondre immédiatement aux requêtes OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    console.log("✅ Réponse OPTIONS envoyée pour", req.url);
    res.status(200).end();
    return;
  }
  
  next();
});

// Body Parser configuration
server.use("/images", express.static(path.join(__dirname, "images")));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use("/api/", apiRouter);

// Gestionnaire d'erreurs global
server.use(function(err, req, res, next) {
  console.error("❌ Erreur serveur:", err);
  res.status(500).json({ error: "Erreur serveur interne" });
});

// Gestionnaire pour les routes non trouvées
server.use(function(req, res) {
  console.log("⚠️  Route non trouvée:", req.method, req.url);
  res.status(404).json({ error: "Route non trouvée" });
});

// Fonction pour créer la base de données si elle n'existe pas
function ensureDatabaseExists() {
  return new Promise(function (resolve, reject) {
    // Connexion sans spécifier la base de données
    var connection = mysql.createConnection({
      host: config.host,
      user: config.username,
      password: config.password
    });

    connection.connect(function (err) {
      if (err) {
        return reject(err);
      }

      // Créer la base de données si elle n'existe pas
      connection.query(
        "CREATE DATABASE IF NOT EXISTS `" + config.database + "`",
        function (err) {
          connection.end();
          if (err) {
            return reject(err);
          }
          console.log("Base de données '" + config.database + "' vérifiée/créée avec succès");
          resolve();
        }
      );
    });
  });
}

// Démarrer le serveur immédiatement (même si la DB n'est pas prête)
try {
  server.listen(8080, function () {
    console.log("✅ Serveur démarré sur http://localhost:8080");
    console.log("📡 API disponible sur http://localhost:8080/api");
    console.log("🔧 CORS configuré pour toutes les origines");
  });
} catch (err) {
  console.error("❌ Erreur lors du démarrage du serveur:", err);
  process.exit(1);
}

// Créer la base de données puis synchroniser (en arrière-plan)
ensureDatabaseExists()
  .then(function () {
    // Synchronisation de la base de données au démarrage
    return models.sequelize.sync({ alter: true });
  })
  .then(function () {
    console.log("✅ Base de données synchronisée avec succès");
  })
  .catch(function (err) {
    console.error("❌ Erreur lors de la synchronisation de la base de données:", err);
    console.log("⚠️  Le serveur continue de fonctionner, mais la base de données peut ne pas être accessible");
  });

module.exports = server;
