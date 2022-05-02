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
    models.Comment.findAll({
      where: { messageId: req.params.messageId },
      include: models.User,
    })

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
  updateComment: function (req, res, next) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);
    var isAdmin = jwtUtils.getAdmin(headerAuth);

    // Params
    let title = req.body.title;
    let content = req.body.content;

    models.Comment.findOne({
      include: models.User,
      where: { id: req.params.commentId },
    })
      .then(function (commentFound) {
        // console.log(commentFound);
        if (isAdmin === true || commentFound.UserId === userId) {
          commentFound.update({
            content: content,
          });
          commentFound
            .save()
            .then(res.status(201).json({ message: "Mise à jour effectué." }));
        } else {
          res.status(403).json({
            message: "Vous n'êtes pas autorisé à effectuer cette requête.",
          });
        }
      })
      .catch(function (err) {
        res.status(400).json(console.log(err));
      });
  },

  deleteComment: function (req, res, next) {
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);
    var isAdmin = jwtUtils.getAdmin(headerAuth);

    models.User.findOne({
      attributes: ["isadmin", "id"],
      where: { id: userId }, //id de l'utilisateur
    })
      .then((userFound) => {
        models.Comment.findOne({
          include: models.User,
          where: { id: req.params.commentId },
        })

          .then(function (messageFound) {
            if (isAdmin === true || messageFound.UserId === userId) {
              models.Comment.destroy({
                where: { id: req.params.commentId },
              })
                .then(() =>
                  res.status(200).json({ message: "Le post a été supprimé" })
                )
                .catch((error) => res.status(400).json({ error }));
            }
            // Si le user qui fait la requête n'est ni admin, ni celui qui a créé le post -> suppression KO
            else {
              return res.status(404).json({
                error:
                  "Vous n'avez pas l'autorisation de supprimer un post qui ne vous appartient pas",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(400).json({ error: "Ce post n'existe plus" });
          });
      })
      .catch((error) => res.status(400).json({ error }));
  },

  /* updateComment: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);
    var isAdmin = jwtUtils.getAdmin(headerAuth);
    // Params
    var content = req.body.content;

    asynclib.waterfall(
      [
        function (done) {
          models.Comment.findOne({
            attributes: ["id", "content", "userId", "isAdmin"],
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
                content: content ? content : userFound.content,
              })
              .then(function () {
                done(userFound);
              })
              .catch(function (err) {
                res
                  .status(500)
                  .json({ error: "Impossible de modifier le commentaire" });
              });
          } else {
            res
              .status(404)
              .json({ error: "Vous ne pouvez pas modifié ce commentaire" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res
            .status(500)
            .json({ error: "Modification du commentaire impossible " });
        }
      }
    );
  },
  updateCommentAdmin: function (req, res) {
    // Params
    var content = req.body.content;
  },*/
};
