// Imports

var models = require("../models");
var asynclib = require("async");
var jwtUtils = require("../utils/jwt.utils");

// Routes
module.exports = {
  createComment: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    // Params
    var messageId = parseInt(req.params.messageId);
    var content = req.body.content;

    if (content == null) {
      return res.status(400).json({ error: " Commentaire vide " });
    }

    console.log(content);
    asynclib.waterfall(
      [
        function (done) {
          models.Message.findOne({
            where: { id: messageId },
          })
            .then(function (messageFound) {
              done(null, messageFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "unable to verify message1" });
            });
        },
        function (messageFound, done) {
          if (messageFound) {
            models.User.findOne({
              where: { id: userId },
            })
              .then(function (userFound) {
                done(null, messageFound, userFound);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "unable to verify user" });
              });
          }
        },
        function (messageFound, userFound, done) {
          if (userFound) {
            models.Comment.create({
              content: content,
              UserId: userFound.id,
              messageId: messageFound.id,
            }).then(function (newComment) {
              done(newComment);
            });
          } else {
            res.status(404).json({ error: "Utilisateur non trouvé" });
          }
        },
      ],
      function (newComment) {
        if (newComment) {
          return res.status(201).json(newComment);
        } else {
          return res
            .status(500)
            .json({ error: "Impossible de poster le message" });
        }
      }
    );
  },
  listComment: function (req, res) {
    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;

    if (limit > 50) {
      limit = 50;
    }
    models.Comment.findAll({})
      .then(function (comment) {
        if (comment) {
          res.status(200).json(comment);
        } else {
          res.status(404).json({ error: "Pas de commentaire trouvé" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "Champs invalide" });
      });
  },
};
