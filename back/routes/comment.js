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

    var content = req.body.content;

    if (content == null) {
      return res.status(400).json({ error: " Commentaire vide " });
    }

    asynclib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: " utilisateur introuvable  " });
            });
        },
        function (userFound, done) {
          if (userFound) {
            models.Comment.create({
              content: content,
              UserId: userFound.id,
            }).then(function (newComment) {
              done(newComment);
            });
          } else {
            res.status(404).json({ error: "utilisateur non trouvé" });
          }
        },
      ],
      function (newComment) {
        if (newComment) {
          return res.status(201).json(newComment);
        } else {
          return res
            .status(201)
            .json({ error: " impossible de poster le commentaire" });
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
    models.Message.findAll({
      order: [order != null ? order.split(":") : ["title", "ASC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.Message,
          attributes: ["content"],
        },
      ],
    })
      .then(function (messages) {
        if (messages) {
          res.status(200).json(messages);
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
