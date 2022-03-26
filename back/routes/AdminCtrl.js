// Imports

var models = require("../models");
var asynclib = require("async");
var jwtUtils = require("../utils/jwt.utils");
const { TRUE } = require("node-sass");
// Routes

module.exports = {
  adminUpdateMessages: function (req, res) {
    // Params
    var title = req.body.title;
    var content = req.body.content;
    var Admin = 1;

    asynclib.waterfall(
      [
        function (done) {
          models.User.findOne({
            attributes: ["id", "isAdmin"],
            where: { Admin: "isAdmin" },
          })

            .then(function (userAdmin) {
              done(null, userAdmin);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "Utilisateur n'est pas Admin" });
            });
        },
        function (userAdmin, done) {
          if (userAdmin) {
            userAdmin
              .update({
                title: title ? title : userFound.title,
                content: content ? content : userFound.content,
              })
              .then(function () {
                done(userAdmin);
              })
              .catch(function (err) {
                res
                  .status(500)
                  .json({ error: "Impossible de modifier le message" });
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
            .json({ error: "Modification du message impossible " });
        }
      }
    );
  },
};