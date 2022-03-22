//Imports
var express = require("express");
var usersCtrl = require("./routes/usersCtrl");
var messagesCtrl = require("./routes/messagesCtrl");
var likesCtrl = require("./routes/likesCtrl");
var commentCtrl = require("./routes/commentCtrl");

// Router
exports.router = (function () {
  var apiRouter = express.Router();

  // routes Users
  apiRouter.route("/users/register/").post(usersCtrl.register);
  apiRouter.route("/users/login/").post(usersCtrl.login);
  apiRouter.route("/users/me").get(usersCtrl.getUserProfile);
  apiRouter.route("/users/me").put(usersCtrl.updateUserProfile);
  apiRouter.route("/users/me").delete(usersCtrl.deleteUserProfile);

  // routes Messages
  apiRouter.route("/messages/new/").post(messagesCtrl.createMessage);
  apiRouter.route("/messages/").get(messagesCtrl.listMessages);
  apiRouter.route("/messages/:messageId/").put(messagesCtrl.updateMessages);

  // Likes et Dislikes
  apiRouter.route("/messages/:messageId/vote/Like").post(likesCtrl.likePost);
  apiRouter
    .route("/messages/:messageId/vote/dislike")
    .post(likesCtrl.dislikePost);

  // Routes Comment
  apiRouter
    .route("/messages/:messageId/comment/new/")
    .post(commentCtrl.createComment);
  apiRouter.route("/messages/:messageId/comment/").get(commentCtrl.listComment);
  apiRouter
    .route("/messages/:messageId/comment/:commentId/")
    .put(commentCtrl.updateComment);

  return apiRouter;
})();
