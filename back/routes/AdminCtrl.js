// Imports

var models = require("../models");
var asynclib = require("async");
var jwtUtils = require("../utils/jwt.utils");
const { TRUE } = require("node-sass");
// Routes

module.exports = {
  adminUpdateMessages: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    // Params
    var title = req.body.title;
    var content = req.body.content;
    //var Admin = 1;

    asynclib.waterfall(
      [
        function (done) {
          models.User.findOne({
            attributes: ["isAdmin"],
            where: { id: userId },
          })
            .then(function (user) {
              done(null, user.isAdmin);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "Utilisateur n'est pas Admin" });
            });
        },
        function () {
          if (user.isAdmin === true) {
            update({
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
