// Imports
var bcrypt = require("bcrypt");
var jwtUtils = require("../utils/jwt.utils");
var models = require("../models");
var asynclib = require("async");

// Constante
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=[^\d_].*?\d)\w(\w|[ !@ #$%]){7,20}/;
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

    if (username.length >= 20 || username.length <= 2) {
      return res.status(400).json({
        error: "le nom d'utilisateur doit etre compris en 2 et 20 lettres",
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        error: " Email Invalide ",
      });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        error:
          "Mot de passe Invalide, il doit contenir minimum 6 et au maximum 20 caractères. Doit inclure une majuscule, une minuscule et un chiffre et des caractères spéciaux et ne peut pas non plus commencer par un chiffre, un trait de soulignement ou un caractère spécial",
      });
    }

    asynclib.waterfall(
      [
        function (done) {
          models.User.findOne({
            attributes: ["email"],
            where: { email: email },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "impossible de verifier l'utilisateur" });
            });
        },
        function (userFound, done) {
          if (!userFound) {
            bcrypt.hash(password, 5, function (err, bcryptedPassword) {
              done(null, userFound, bcryptedPassword);
            });
          } else {
            return res.status(409).json({ error: "user deja existant" });
          }
        },
        function (userFound, bcryptedPassword, done) {
          var newUser = models.User.create({
            email: email,
            username: username,
            password: bcryptedPassword,
            job: job,
            isAdmin: 0,
          })
            .then(function (newUser) {
              done(newUser);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "Impossible d'ajouter l'utilisateur" });
            });
        },
      ],
      function (newUser) {
        if (newUser) {
          return res.status(201).json({
            userId: newUser.id,
          });
        } else {
          return res
            .status(500)
            .json({ error: "Impossible d'ajouter l'utilisateur" });
        }
      }
    );
  },
  login: function (req, res) {
    // Params
    var email = req.body.email;
    var password = req.body.password;

    if (email == null || password == null) {
      return res.status(400).json({ error: " Parametre manquant " });
    }

    asynclib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { email: email },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "Impossible de verfier l'utilisateur" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            bcrypt.compare(
              password,
              userFound.password,
              function (errBycrypt, resBycrypt) {
                done(null, userFound, resBycrypt);
              }
            );
          } else {
            return res.status(404).json({
              error: "Utilisateur non existant dans la base de donnée ",
            });
          }
        },
        function (userFound, resBycrypt, done) {
          if (resBycrypt) {
            done(userFound);
          } else {
            return res.status(403).json({ error: "password invalid " });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json({
            userId: userFound.id,
            token: jwtUtils.generateTokenForUser(userFound),
          });
        } else {
          return res.status(500).json({ error: "conections impossible" });
        }
      }
    );
  },
  getUserProfile: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) return res.status(400).json({ error: "wrong token" });

    models.User.findOne({
      attributes: ["id", "email", "username", "job"],
      where: { id: userId },
    })
      .then(function (user) {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: "Utilisateur inexistant1 " });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "cannot fetch user" });
      });
  },
  updateUserProfile: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    // Params
    var job = req.body.job;
    console.log(job);
    asynclib.waterfall(
      [
        function (done) {
          models.User.findOne({
            attributes: ["id", "job"],
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "Impossible de verifier Utilisateur" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            userFound
              .update({
                job: job ? job : userFound.job,
              })
              .then(function () {
                done(userFound);
              })
              .catch(function (err) {
                res
                  .status(500)
                  .json({ error: "Impossible de modifier l'utilisateur" });
              });
          } else {
            res.status(404).json({ error: "Utilisateur inexistant2" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res
            .status(500)
            .json({ error: "Modification du profile impossible " });
        }
      }
    );
  },
};
