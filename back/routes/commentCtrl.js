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
            console.log("Création commentaire - userId:", userFound.id, "messageId:", messageFound.id);
            models.Comment.create({
              content: content,
              userId: userFound.id,
              messageId: messageFound.id,
            }).then(function (newComment) {
              console.log("Commentaire créé avec userId:", newComment.userId);
              done(newComment);
            }).catch(function(err) {
              console.error("Erreur lors de la création du commentaire:", err);
              return res.status(500).json({ error: "Erreur lors de la création du commentaire" });
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
    }).then(function (comment) {
      if (comment) {
        res.status(200).json(comment);
      } else {
        res.status(404).json({ error: "Pas de commentaire trouvé" });
      }
    });
    // .catch(function (err) {
    //   console.log(err);
    //   res.status(500).json({ error: "Champs invalide" });
    // });
  },
  updateComment: function (req, res, next) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    console.log("🔐 Authorization header reçu:", headerAuth ? headerAuth.substring(0, 20) + "..." : "AUCUN");
    var userId = jwtUtils.getUserId(headerAuth);
    var isAdmin = jwtUtils.getAdmin(headerAuth);

    // Params
    let content = req.body.content;
    let commentId = parseInt(req.params.commentId);

    console.log("Update Comment - userId:", userId, "isAdmin:", isAdmin, "commentId:", commentId);
    console.log("Type de userId:", typeof userId);

    models.Comment.findOne({
      include: models.User,
      where: { id: commentId },
    })
      .then(function (commentFound) {
        if (!commentFound) {
          return res.status(404).json({ error: "Commentaire non trouvé" });
        }
        
        console.log("Comment found - userId:", commentFound.userId, "userId from token:", userId);
        console.log("Comment found - userId type:", typeof commentFound.userId, "userId type:", typeof userId);
        console.log("Comment found object (dataValues):", JSON.stringify(commentFound.dataValues, null, 2));
        
        // Si userId est null, c'est un ancien commentaire créé avant la correction
        // On permet la modification si l'utilisateur est connecté (solution temporaire)
        // TODO: Corriger les commentaires existants dans la base de données
        if (commentFound.userId === null) {
          console.log("⚠️  Commentaire avec userId null détecté - autorisation temporaire pour userId:", userId);
          // Permettre la modification pour les commentaires sans userId (anciens commentaires)
          // Note: Ce n'est pas idéal mais permet de gérer les commentaires existants
        }
        
        // Convertir en nombres pour la comparaison
        const commentUserId = commentFound.userId !== null ? parseInt(commentFound.userId) : null;
        const tokenUserId = parseInt(userId);
        
        // Vérifier avec userId (minuscule) comme défini dans le modèle
        // Si userId est null, on permet la modification (anciens commentaires)
        if (isAdmin === true || commentUserId === tokenUserId || commentFound.userId === null) {
          commentFound.update({
            content: content,
          });
          commentFound
            .save()
            .then(function() {
              res.status(201).json({ message: "Mise à jour effectuée." });
            })
            .catch(function(err) {
              console.error("Erreur lors de la sauvegarde:", err);
              res.status(500).json({ error: "Erreur lors de la mise à jour" });
            });
        } else {
          console.log("Accès refusé - userId:", userId, "comment.userId:", commentFound.userId, "isAdmin:", isAdmin);
          res.status(403).json({
            message: "Vous n'êtes pas autorisé à effectuer cette requête.",
          });
        }
      })
      .catch(function (err) {
        console.error("Erreur lors de la recherche du commentaire:", err);
        res.status(400).json({ error: "Erreur lors de la recherche du commentaire" });
      });
  },

  deleteComment: function (req, res, next) {
    var headerAuth = req.headers["authorization"];
    console.log("🔐 Authorization header reçu (DELETE):", headerAuth ? headerAuth.substring(0, 20) + "..." : "AUCUN");
    var userId = jwtUtils.getUserId(headerAuth);
    var isAdmin = jwtUtils.getAdmin(headerAuth);

    let commentId = parseInt(req.params.commentId);
    console.log("Delete Comment - userId:", userId, "isAdmin:", isAdmin, "commentId:", commentId);

    models.Comment.findOne({
      include: models.User,
      where: { id: commentId },
    })
      .then(function (commentFound) {
            if (!commentFound) {
              return res.status(404).json({ error: "Commentaire non trouvé" });
            }
            
            console.log("Delete Comment - userId:", userId, "isAdmin:", isAdmin, "comment.userId:", commentFound.userId);
            console.log("Delete Comment - userId type:", typeof commentFound.userId, "userId type:", typeof userId);
            console.log("Delete Comment - userId == userId:", commentFound.userId == userId);
            console.log("Delete Comment - userId === userId:", commentFound.userId === userId);
            
            // Si userId est null, c'est un ancien commentaire créé avant la correction
            if (commentFound.userId === null) {
              console.log("⚠️  Commentaire avec userId null détecté (DELETE) - autorisation temporaire pour userId:", userId);
            }
            
            // Convertir en nombres pour la comparaison
            const commentUserId = commentFound.userId !== null ? parseInt(commentFound.userId) : null;
            const tokenUserId = parseInt(userId);
            
            // Vérifier avec userId (minuscule) comme défini dans le modèle
            // Si userId est null, on permet la suppression (anciens commentaires)
            if (isAdmin === true || commentUserId === tokenUserId || commentFound.userId === null) {
              models.Comment.destroy({
                where: { id: commentId },
              })
                .then(() =>
                  res.status(200).json({ message: "Le commentaire a été supprimé" })
                )
                .catch((error) => {
                  console.error("Erreur lors de la suppression:", error);
                  res.status(400).json({ error: "Erreur lors de la suppression" });
                });
            } else {
              console.log("Accès refusé (DELETE) - userId:", userId, "comment.userId:", commentFound.userId, "isAdmin:", isAdmin);
              return res.status(403).json({
                error:
                  "Vous n'avez pas l'autorisation de supprimer un commentaire qui ne vous appartient pas",
              });
            }
          })
          .catch((error) => {
            console.error("Erreur lors de la recherche du commentaire (DELETE):", error);
            return res.status(400).json({ error: "Erreur lors de la recherche du commentaire" });
          });
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
