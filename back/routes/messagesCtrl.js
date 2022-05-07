// Imports

var models = require("../models");
var asynclib = require("async");
var jwtUtils = require("../utils/jwt.utils");
const multer = require("../utils/multer-config");
const message = require("../models/message");

// Routes
module.exports = {
  createMessage: function (req, res) {
    // const attachementimage = JSON.parse(req.body.attachement);
    // var attachement = multer(attachementimage);
    // delete attachementimage._id;
    // const attachement = new attachement({
    //   ...messageattachement,
    //   multer(attachementimage) {
    //     attachement: `${req.protocol}://${req.get("host")}/images/${
    //       req.file.filename
    //     }`;
    //   },
    // });
    // attachement
    //   .save()
    //   .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    //   .catch((error) => res.status(400).json({ error }));

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

    if (title.length <= 2 || content.length <= 3) {
      return res.status(400).json({
        error: " le Titre ou le contenu de votre article sont trop court",
      });
    }

    asynclib.waterfall(
      [
        function (done) {
          models.User.findOne({
            attributes: ["username", "id"],
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
              console.log(userFound);
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
              username: userFound.username,
              attachement: "attachementimage",
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

    if (limit > 50) {
      limit = 50;
    }

    models.Message.findAll({
      include: models.User,

      order: [order != null ? order.split(":") : ["title", "ASC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,

      order: [["createdAt", "DESC"]],
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

  updateMessages: function (req, res, next) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);
    var isAdmin = jwtUtils.getAdmin(headerAuth);

    // Params
    let title = req.body.title;
    let content = req.body.content;

    models.Message.findOne({
      include: models.User,
      where: { id: req.params.messageId },
    })
      .then(function (messageFound) {
        if (isAdmin === true || messageFound.UserId === userId) {
          messageFound.set({
            title: title,
            content: content,
          });
          messageFound
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

  deleteMessages: function (req, res, next) {
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);
    var isAdmin = jwtUtils.getAdmin(headerAuth);

    models.User.findOne({
      attributes: ["isadmin", "id"],
      where: { id: userId }, //id de l'utilisateur
    })
      .then((userFound) => {
        models.Message.findOne({
          include: models.User,
          where: { id: req.params.messageId },
        })

          .then(function (messageFound) {
            if (isAdmin === true || messageFound.UserId === userId) {
              models.Message.destroy({
                where: { id: req.params.messageId },
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

  /* updateMessages: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);
    var isAdmin = jwtUtils.getAdmin(headerAuth);
    // Params
    var title = req.body.title;
    var content = req.body.content;

    asynclib.waterfall(
      [
        function (user, done) {
          models.User.findOne({
            where: { id: userId },
          }).then(
            function (user, done) {
              models.Message.findOne({
                attributes: ["id", "userId", "title", "content"],
                include: models.User,
                where: { userId: user.id },
              })
                .then(function (user) {
                  done(null, user);
                })
                .catch(function (err) {
                  return res
                    .status(500)
                    .json({ error: "Impossible de verifier Utilisateur" });
                });
              console.log(user.id);
              console.log(userId);
              console.log(user);
            },
            function (userFound, done) {
              if (user) {
                user
                  .update({
                    title: title ? title : message.title,
                    content: content ? content : message.content,
                  })
                  .then(function () {
                    done(user);
                  })
                  .catch(function (err) {
                    res
                      .status(500)
                      .json({ error: "Impossible de modifier le message" });
                  });
              } else {
                res.status(404).json({ error: "Utilisateur inexistant2" });
              }
            }
          );
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res

            .status(500)
            .json({ error: "Modification du message impossible " });
        }
      }
    );
  },*/
};
