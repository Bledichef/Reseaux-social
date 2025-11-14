"use strict";

module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define(
    "Comment",
    {
      content: DataTypes.STRING,
    },
    {}
  );
  Comment.associate = function (models) {
    // associations can be defined here

    models.Comment.belongsTo(models.Message, {
      foreignKey: "messageId",
      onDelete: "CASCADE",
    });

    models.Comment.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };
  return Comment;
};
