// Imports
var bcrypt = require("bcrypt");
var jwtUtils = require("../utils/jwt.utils");
var models = require("../models");

// Routes
module.exports = {
  register: function (req, res) {
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var job = req.body.job;

    if (email == null || username == null || password == null || job == null) {
      return res.status(400).json({ error: "parametre manquant" });
    }

    models.User.findOne({
      attributes: ["email"],
      where: { email: email },
    })
      .then(function (userFound) {
        if (!userFound) {
          bcrypt.hash(password, 10, function (err, bcryptedPassword) {
            var newUser = models.User.create({
              email: email,
              username: username,
              password: bcryptedPassword,
              job: job,
              isAdmin: 0,
            })
              .then(function (newUser) {
                return res.status(201).json({
                  userId: newUser.id,
                });
              })
              .catch(function (err) {
                return res
                  .status(500)
                  .json({ error: "impossible d'ajouter l'utilisateur" });
              });
          });
        } else {
          return res.status(409).json({
            error: "Utilisateur deja present avec cette adresse mail",
          });
        }
      })
      .catch(function (err) {
        return res
          .status(500)
          .json({ error: "Impossible de verifier l'utilisateur" });
      });
  },
  login: function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (email == null || password == null) {
      return res.status(400).json({ error: "paramètre manquant " });
    }

    models.User.findOne({
      where: { email: email },
    })
      .then(function (userFound) {
        if (userFound) {
          bcrypt.compare(
            password,
            userFound.password,
            function (errBycrypt, resBycrypt) {
              if (resBycrypt) {
                return res.status(200).json({
                  userId: userFound.id,
                  token: jwtUtils.generateTokenForUser(userFound),
                });
              } else {
                return res.status(403).json({ error: "Mot de passe invalide" });
              }
            }
          );
        } else {
          return res.status(404).json({
            error: " Utilisateur non existant dans la base de donnée ",
          });
        }
      })
      .catch(function (err) {
        return res
          .status(500)
          .json({ error: "impossible de verifier l'utilisateur" });
      });
  },
};
