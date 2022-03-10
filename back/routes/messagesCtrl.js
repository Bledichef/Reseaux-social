// Imports

var models = require("../models");
var asynclib = require("async");
var jwtUtils = require("../utils/jwt.utils");
const { request } = require("express");

// Routes
module.exports = {
  createMessage: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    // Params

    var title = req.body.title;
    var content = req.body.content;
    console.log(title);
    console.log(content);
    if (title == null || content == null) {
      return res.status(400).json({ error: " Titre ou article vide " });
    }

    if (title.length <= 2 || content.length <= 5) {
      return res.status(400).json({
        error: " le Titre ou le contenu de votre article sont trop court",
      });
    }
    console.log(title);
    console.log(content);
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
              return res.status(500).json({ error: " utilisateur non trouvé" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            models.Message.create({
              title: title,
              content: content,
              likes: 0,
              UserId: userFound.id,
            }).then(function (newMessage) {
              done(newMessage);
            });
          } else {
            res.status(404).json({ error: "Utilisateur non trouvé" });
          }
        },
      ],
      function (newMessage) {
        if (newMessage) {
          return res.status(201).json(newMessage);
        } else {
          return res
            .status(500)
            .json({ error: "Impossible de poster le message" });
        }
      }
    );
  },

  listMessages: function (req, res) {
    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;

    models.Message.findAll({
      order: [order != null ? order.split(":") : ["title", "ASC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ["username"],
        },
      ],
    })
      .then(function (messages) {
        if (messages) {
          res.status(200).json(messages);
        } else {
          res.status(404).json({ error: "Pas de message trouvé" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "Champs invalide" });
      });
  },
};
